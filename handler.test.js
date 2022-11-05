const { virusScan } = require("./handler");

var mockPutObjectTagging;
var mockPromise;

jest.mock("aws-sdk", () => {
  mockPromise = jest.fn();
  mockPutObjectTagging = jest.fn().mockReturnThis();

  return {
    S3: jest.fn().mockReturnValue({
      getObject: jest.fn().mockReturnThis(),
      putObjectTagging: mockPutObjectTagging,
      promise: mockPromise,
    }),
  };
});

var mockReadFileSync;
var mockWriteFileSync;
var mockUnlinkSync;

jest.mock("fs", () => {
  mockReadFileSync = jest.fn();
  mockWriteFileSync = jest.fn();
  mockUnlinkSync = jest.fn();

  return {
    readFileSync: mockReadFileSync,
    writeFileSync: mockWriteFileSync,
    unlinkSync: mockUnlinkSync,
  };
});

var mockExecSync;

jest.mock("child_process", () => {
  mockExecSync = jest.fn();

  return {
    execSync: mockExecSync,
  };
});

describe("handler.virusScan", () => {
  let mockValidEvent;

  beforeAll(() => {
    // console.log = jest.fn();

    mockValidEvent = {
      Records: [
        {
          s3: {
            bucket: { name: "bucket-name" },
            object: { key: "file-to-scan.jpeg" },
          },
        },
      ],
    };
  });

  it("calls an event with no event.Records", async () => {
    const event = {};
    await virusScan(event);

    // expect(console.log).toHaveBeenCalled();
    // expect(console.log).toHaveBeenCalledWith('Not an S3 event invocation!');
    expect(mockWriteFileSync).not.toHaveBeenCalled();
  });

  it("calls an event with no event.Records[].s3", async () => {
    const event = {
      Records: [
        {
          notS3: { foo: "bar" },
        },
      ],
    };

    await virusScan(event);

    // expect(console.log).toHaveBeenCalled();
    // expect(console.log).toHaveBeenCalledWith('Not an S3 Record!');
    expect(mockWriteFileSync).not.toHaveBeenCalled();
  });

  it("calls with a clean file", async () => {
    mockPromise.mockImplementationOnce(() => ({ Body: "body" }));

    await virusScan(mockValidEvent);

    expect(mockExecSync).toHaveBeenCalledWith(
      "clamscan /tmp/file-to-scan.jpeg"
    );
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      "/tmp/file-to-scan.jpeg",
      "body"
    );
    expect(mockUnlinkSync).toHaveBeenCalledWith("/tmp/file-to-scan.jpeg");
    expect(mockPutObjectTagging).toHaveBeenCalledWith({
      Bucket: "bucket-name",
      Key: "file-to-scan.jpeg",
      Tagging: {
        TagSet: [{ Key: "av-status", Value: "clean" }],
      },
    });
  });

  it.only("calls with a virus file", async () => {
    mockPromise.mockImplementationOnce(() => ({ Body: "body" }));
    mockExecSync.mockImplementationOnce(() => {
      throw { code: 1 };
    });

    await virusScan(mockValidEvent);

    expect(mockExecSync).toHaveBeenCalledWith(
      "clamscan /tmp/file-to-scan.jpeg"
    );
    expect(mockWriteFileSync).toHaveBeenCalledWith(
      "/tmp/file-to-scan.jpeg",
      "body"
    );
    expect(mockUnlinkSync).toHaveBeenCalledWith("/tmp/file-to-scan.jpeg");
    expect(mockPutObjectTagging).toHaveBeenCalledWith({
      Bucket: "bucket-name",
      Key: "file-to-scan.jpeg",
      Tagging: {
        TagSet: [{ Key: "av-status", Value: "dirty" }],
      },
    });
  });
});
