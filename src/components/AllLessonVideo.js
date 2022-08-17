import React, { useState } from "react";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
// var AWS = require('aws-sdk');
import MediaConvert from "aws-sdk/clients/mediaconvert";
// Set the Region
// AWS.config.update({region: 'us-east-1'});
// Set the custom endpoint for your account
// AWS.config.mediaconvert = {};

var videoFile;
var credentials = {
  accessKeyId: "AKIA5PW5INIX25E2FKL7",
  secretAccessKey: "9ClRajRwphj6iCt8EVAyZV4+NdO6XCXvpg3wo+EU",
};

export default function AllLessonVideo() {
  let [progress, setProgress] = useState(-1);
  let [activeLessonVideo, setActivevLessonVideo] = useState({
    type: "video",
  });

  let updateUI = (e, mode) => {
    let val = e.target.value;

    if (mode == "video") {
      videoFile = e.target.files[0];
      activeLessonVideo[mode] = videoFile;
      setActivevLessonVideo({ ...activeLessonVideo, mode: videoFile });
    } else {
      activeLessonVideo[mode] = val;
      setActivevLessonVideo({ ...activeLessonVideo, mode: val });
    }
  };

  let addLesson = async (event, lesson) => {
    if (
      lesson.video == null ||
      lesson.thumbnail_url == undefined ||
      lesson.name == undefined
    ) {
      alert("please complete the form");
      return;
    }
    event.preventDefault();
    uploadVideo(lesson.video);
  };
  let uploadVideo = async (video) => {
    let uid = "id" + new Date().getTime();

    try {
      const parallelUploads3 = new Upload({
        client:
          new S3({ region: "us-east-1", credentials: credentials }) ||
          new S3Client({}),
        params: {
          Bucket: "quasaredtech-adminuploads",
          Key: uid + "." + video.name.split(".").pop(),
          Body: video,
        },

        tags: [
          /*...*/
        ], // optional tags
        queueSize: 4, // optional concurrency configuration
        partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB
        leavePartsOnError: false, // optional manually handle dropped parts
      });

      parallelUploads3.on("httpUploadProgress", (progress) => {
        //TODO update progress bar
        console.log("progress", progress);
        // setProgress(progress);
      });

      await parallelUploads3.done();
      // setProgress(-1);
      mediaConvertService(uid);
    } catch (e) {
      console.log(e);
    }
  };

  let mediaConvertService = (uid) => {
    console.log("making diff quality vid now for uid " + uid);
    let endpointPromise = new MediaConvert({
      apiVersion: "2017-08-29",
      endpoint: "https://vasjpylpa.mediaconvert.us-east-1.amazonaws.com",
      region: "us-east-1",
      credentials: credentials,
    })
      .createJob(params)
      .promise();

    endpointPromise.then(
      function (data) {
        console.log("Job created! ", data);
      },
      function (err) {
        console.log("Error", err);
      }
    );

    // let params1 = {
    //   MaxResults: 10,
    //   Order: "ASCENDING",
    //   Queue: "QUEUE_ARN",
    //   Status: "SUBMITTED",
    // };

    // Create a promise on a MediaConvert object
  //   let prom = new MediaConvert({
  //     apiVersion: "2017-08-29",
  //     endpoint: "https://vasjpylpa.mediaconvert.us-east-1.amazonaws.com",
  //     region: "us-east-1",
  //     credentials: credentials,
  //   })
  //     .listJobs(params1)
  //     .promise();

  //   // Handle promise's fulfilled/rejected status
  //   console.log("next line promise");
  //   prom.then(
  //     function (data) {
  //       console.log("Jobs: ", data);
  //     },
  //     function (err) {
  //       console.log("Error", err);
  //     }
  //   );
  };

  return (
    <div>
      <>
        {progress != -1 ? (
          <div class="progress">
            <div
              class="progress-bar"
              role="progressbar"
              style="width: 75%;"
              aria-valuenow="75"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        ) : null}
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={activeLessonVideo.name}
            onChange={(event) => {
              updateUI(event, "name");
            }}
          />
          <label htmlFor="floatingInput">Title</label>
        </div>

        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            onChange={(event) => {
              updateUI(event, "video");
              // getVideoFile(event);
            }}
            type="file"
            accept="video/*"
          />
          <label htmlFor="floatingInput">Video </label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={activeLessonVideo.thumbnail_url}
            onChange={(event) => {
              updateUI(event, "thumbnail_url");
            }}
          />
          <label htmlFor="floatingInput">Thumbnail Url</label>
        </div>

        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={(event) => {
              addLesson(event, activeLessonVideo);
            }}
          >
            Add Lesson
          </button>
        </>
      </>
    </div>
  );
}

const params = {
  Queue: "JOB_QUEUE_ARN",
  UserMetadata: {
    Customer: "Amazon",
  },
  Role: "arn:aws:iam::927103216175:role/service-role/MediaConvert_Default_Role",
  Settings: {
    OutputGroups: [
      {
        Name: "File Group",
        OutputGroupSettings: {
          Type: "FILE_GROUP_SETTINGS",
          FileGroupSettings: {
            Destination: "s3://quasar-edtech-stream",
          },
        },
        Outputs: [
          {
            VideoDescription: {
              ScalingBehavior: "DEFAULT",
              TimecodeInsertion: "DISABLED",
              AntiAlias: "ENABLED",
              Sharpness: 50,
              CodecSettings: {
                Codec: "H_264",
                H264Settings: {
                  InterlaceMode: "PROGRESSIVE",
                  NumberReferenceFrames: 3,
                  Syntax: "DEFAULT",
                  Softness: 0,
                  GopClosedCadence: 1,
                  GopSize: 90,
                  Slices: 1,
                  GopBReference: "DISABLED",
                  SlowPal: "DISABLED",
                  SpatialAdaptiveQuantization: "ENABLED",
                  TemporalAdaptiveQuantization: "ENABLED",
                  FlickerAdaptiveQuantization: "DISABLED",
                  EntropyEncoding: "CABAC",
                  Bitrate: 5000000,
                  FramerateControl: "SPECIFIED",
                  RateControlMode: "CBR",
                  CodecProfile: "MAIN",
                  Telecine: "NONE",
                  MinIInterval: 0,
                  AdaptiveQuantization: "HIGH",
                  CodecLevel: "AUTO",
                  FieldEncoding: "PAFF",
                  SceneChangeDetect: "ENABLED",
                  QualityTuningLevel: "SINGLE_PASS",
                  FramerateConversionAlgorithm: "DUPLICATE_DROP",
                  UnregisteredSeiTimecode: "DISABLED",
                  GopSizeUnits: "FRAMES",
                  ParControl: "SPECIFIED",
                  NumberBFramesBetweenReferenceFrames: 2,
                  RepeatPps: "DISABLED",
                  FramerateNumerator: 30,
                  FramerateDenominator: 1,
                  ParNumerator: 1,
                  ParDenominator: 1,
                },
              },
              AfdSignaling: "NONE",
              DropFrameTimecode: "ENABLED",
              RespondToAfd: "NONE",
              ColorMetadata: "INSERT",
            },
            AudioDescriptions: [
              {
                AudioTypeControl: "FOLLOW_INPUT",
                CodecSettings: {
                  Codec: "AAC",
                  AacSettings: {
                    AudioDescriptionBroadcasterMix: "NORMAL",
                    RateControlMode: "CBR",
                    CodecProfile: "LC",
                    CodingMode: "CODING_MODE_2_0",
                    RawFormat: "NONE",
                    SampleRate: 48000,
                    Specification: "MPEG4",
                    Bitrate: 64000,
                  },
                },
                LanguageCodeControl: "FOLLOW_INPUT",
                AudioSourceName: "Audio Selector 1",
              },
            ],
            ContainerSettings: {
              Container: "MP4",
              Mp4Settings: {
                CslgAtom: "INCLUDE",
                FreeSpaceBox: "EXCLUDE",
                MoovPlacement: "PROGRESSIVE_DOWNLOAD",
              },
            },
            NameModifier: "_1",
          },
        ],
      },
    ],
    AdAvailOffset: 0,
    Inputs: [
      {
        AudioSelectors: {
          "Audio Selector 1": {
            Offset: 0,
            DefaultSelection: "NOT_DEFAULT",
            ProgramSelection: 1,
            SelectorType: "TRACK",
            Tracks: [1],
          },
        },
        VideoSelector: {
          ColorSpace: "FOLLOW",
        },
        FilterEnable: "AUTO",
        PsiControl: "USE_PSI",
        FilterStrength: 0,
        DeblockFilter: "DISABLED",
        DenoiseFilter: "DISABLED",
        TimecodeSource: "EMBEDDED",
        FileInput: "s3://quasaredtech-adminuploads/id1660770528371.mp4",
      },
    ],
    TimecodeConfig: {
      Source: "EMBEDDED",
    },
  },
};
