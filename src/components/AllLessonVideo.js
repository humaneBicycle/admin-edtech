import React, { useState } from "react";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import MediaConvert from "aws-sdk/clients/mediaconvert";
import LinkHelper from "../utils/LinkHelper";
import { useLocation } from "react-router";

var videoFile;
let uid;
var credentials = {
  accessKeyId: "AKIA5PW5INIX25E2FKL7",
  secretAccessKey: "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",
};
let videoUId;

export default function AllLessonVideo() {
  let [progress, setProgress] = useState(-1);
  const location = useLocation();
  let {unit} = location.state;
  // console.log(unit)

  let [activeLessonVideo, setActiveLessonVideo] = useState({
    type: "video",
    unit_id: unit.unit_id,
    video_id: "fasdfd"
  });
  

  let updateUI = (e, mode) => {
    let val;
    if(mode!="video_id"){
      val = e.target.value;
    }

    if (mode === "video") {
      videoFile = e.target.files[0];
      activeLessonVideo[mode] = videoFile;
      uid = "id" + new Date().getTime();
      videoUId=uid+videoFile.name.split(".").pop();
      console.log(uid)
      // activeLessonVideo.video_id = uid;
      setActiveLessonVideo({ ...activeLessonVideo, "video_id": uid });
    } else {
      activeLessonVideo[mode] = val;
      
      setActiveLessonVideo({ ...activeLessonVideo, mode: val });
    }
  };

  let addLesson = async (event, lesson) => {
    event.preventDefault();
    if (
      lesson.video == null ||
      lesson.thumbnail_url == undefined ||
      lesson.title == undefined ||
      lesson.description == undefined 
    ) {
      alert("please complete the form");
      return;
    }
    // console.log(activeLessonVideo);
    uploadVideo(lesson.video);
  };
  let uploadVideo = async (video) => {
    
    // console.log(videoUId)

    try {
      const parallelUploads3 = new Upload({
        client:
          new S3({ region: "us-east-1", credentials: credentials }) ||
          new S3Client({}),
        params: {
          Bucket: "quasaredtech-adminuploads",
          Key: uid,
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
      mediaConvertService();
    } catch (e) {
      console.log(e);
    }
  };

  let mediaConvertService = () => {
    let params = {
      UserMetadata: {},
      Role: "arn:aws:iam::927103216175:role/service-role/MediaConvert_Default_Role",
      Settings: {
        "OutputGroups": [
          {
            "CustomName": "HLS",
            "Name": "Apple HLS",
            "Outputs": [
              {
                "ContainerSettings": {
                  "Container": "M3U8",
                  "M3u8Settings": {
                    "AudioFramesPerPes": 4,
                    "PcrControl": "PCR_EVERY_PES_PACKET",
                    "PmtPid": 480,
                    "PrivateMetadataPid": 503,
                    "ProgramNumber": 1,
                    "PatInterval": 0,
                    "PmtInterval": 0,
                    "Scte35Source": "NONE",
                    "TimedMetadata": "NONE",
                    "VideoPid": 481,
                    "AudioPids": [
                      482,
                      483,
                      484,
                      485,
                      486,
                      487,
                      488,
                      489,
                      490,
                      491,
                      492
                    ]
                  }
                },
                "VideoDescription": {
                  "Width": 640,
                  "ScalingBehavior": "DEFAULT",
                  "Height": 360,
                  "TimecodeInsertion": "DISABLED",
                  "AntiAlias": "ENABLED",
                  "Sharpness": 50,
                  "CodecSettings": {
                    "Codec": "H_264",
                    "H264Settings": {
                      "InterlaceMode": "PROGRESSIVE",
                      "NumberReferenceFrames": 3,
                      "Syntax": "DEFAULT",
                      "Softness": 0,
                      "GopClosedCadence": 1,
                      "GopSize": 90,
                      "Slices": 1,
                      "GopBReference": "DISABLED",
                      "SlowPal": "DISABLED",
                      "SpatialAdaptiveQuantization": "ENABLED",
                      "TemporalAdaptiveQuantization": "ENABLED",
                      "FlickerAdaptiveQuantization": "DISABLED",
                      "EntropyEncoding": "CABAC",
                      "Bitrate": 1000000,
                      "FramerateControl": "INITIALIZE_FROM_SOURCE",
                      "RateControlMode": "CBR",
                      "CodecProfile": "MAIN",
                      "Telecine": "NONE",
                      "MinIInterval": 0,
                      "AdaptiveQuantization": "HIGH",
                      "CodecLevel": "AUTO",
                      "FieldEncoding": "PAFF",
                      "SceneChangeDetect": "ENABLED",
                      "QualityTuningLevel": "SINGLE_PASS",
                      "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                      "UnregisteredSeiTimecode": "DISABLED",
                      "GopSizeUnits": "FRAMES",
                      "ParControl": "INITIALIZE_FROM_SOURCE",
                      "NumberBFramesBetweenReferenceFrames": 2,
                      "RepeatPps": "DISABLED"
                    }
                  },
                  "AfdSignaling": "NONE",
                  "DropFrameTimecode": "ENABLED",
                  "RespondToAfd": "NONE",
                  "ColorMetadata": "INSERT"
                },
                "AudioDescriptions": [
                  {
                    "AudioTypeControl": "FOLLOW_INPUT",
                    "CodecSettings": {
                      "Codec": "AAC",
                      "AacSettings": {
                        "AudioDescriptionBroadcasterMix": "NORMAL",
                        "Bitrate": 96000,
                        "RateControlMode": "CBR",
                        "CodecProfile": "LC",
                        "CodingMode": "CODING_MODE_2_0",
                        "RawFormat": "NONE",
                        "SampleRate": 48000,
                        "Specification": "MPEG4"
                      }
                    },
                    "LanguageCodeControl": "FOLLOW_INPUT"
                  }
                ],
                "OutputSettings": {
                  "HlsSettings": {
                    "AudioGroupId": "program_audio",
                    "AudioRenditionSets": "program_audio",
                    "SegmentModifier": "$dt$",
                    "IFrameOnlyManifest": "EXCLUDE"
                  }
                },
                "NameModifier": "_360"
              },
              {
                "ContainerSettings": {
                  "Container": "M3U8",
                  "M3u8Settings": {
                    "AudioFramesPerPes": 4,
                    "PcrControl": "PCR_EVERY_PES_PACKET",
                    "PmtPid": 480,
                    "PrivateMetadataPid": 503,
                    "ProgramNumber": 1,
                    "PatInterval": 0,
                    "PmtInterval": 0,
                    "Scte35Source": "NONE",
                    "Scte35Pid": 500,
                    "TimedMetadata": "NONE",
                    "TimedMetadataPid": 502,
                    "VideoPid": 481,
                    "AudioPids": [
                      482,
                      483,
                      484,
                      485,
                      486,
                      487,
                      488,
                      489,
                      490,
                      491,
                      492
                    ]
                  }
                },
                "VideoDescription": {
                  "Width": 960,
                  "ScalingBehavior": "DEFAULT",
                  "Height": 540,
                  "TimecodeInsertion": "DISABLED",
                  "AntiAlias": "ENABLED",
                  "Sharpness": 50,
                  "CodecSettings": {
                    "Codec": "H_264",
                    "H264Settings": {
                      "InterlaceMode": "PROGRESSIVE",
                      "NumberReferenceFrames": 3,
                      "Syntax": "DEFAULT",
                      "Softness": 0,
                      "GopClosedCadence": 1,
                      "GopSize": 90,
                      "Slices": 1,
                      "GopBReference": "DISABLED",
                      "SlowPal": "DISABLED",
                      "SpatialAdaptiveQuantization": "ENABLED",
                      "TemporalAdaptiveQuantization": "ENABLED",
                      "FlickerAdaptiveQuantization": "DISABLED",
                      "EntropyEncoding": "CABAC",
                      "Bitrate": 2000000,
                      "FramerateControl": "INITIALIZE_FROM_SOURCE",
                      "RateControlMode": "CBR",
                      "CodecProfile": "MAIN",
                      "Telecine": "NONE",
                      "MinIInterval": 0,
                      "AdaptiveQuantization": "HIGH",
                      "CodecLevel": "AUTO",
                      "FieldEncoding": "PAFF",
                      "SceneChangeDetect": "ENABLED",
                      "QualityTuningLevel": "SINGLE_PASS",
                      "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                      "UnregisteredSeiTimecode": "DISABLED",
                      "GopSizeUnits": "FRAMES",
                      "ParControl": "INITIALIZE_FROM_SOURCE",
                      "NumberBFramesBetweenReferenceFrames": 2,
                      "RepeatPps": "DISABLED"
                    }
                  },
                  "AfdSignaling": "NONE",
                  "DropFrameTimecode": "ENABLED",
                  "RespondToAfd": "NONE",
                  "ColorMetadata": "INSERT"
                },
                "AudioDescriptions": [
                  {
                    "AudioTypeControl": "FOLLOW_INPUT",
                    "CodecSettings": {
                      "Codec": "AAC",
                      "AacSettings": {
                        "AudioDescriptionBroadcasterMix": "NORMAL",
                        "Bitrate": 96000,
                        "RateControlMode": "CBR",
                        "CodecProfile": "LC",
                        "CodingMode": "CODING_MODE_2_0",
                        "RawFormat": "NONE",
                        "SampleRate": 48000,
                        "Specification": "MPEG4"
                      }
                    },
                    "LanguageCodeControl": "FOLLOW_INPUT"
                  }
                ],
                "OutputSettings": {
                  "HlsSettings": {
                    "AudioGroupId": "program_audio",
                    "AudioRenditionSets": "program_audio",
                    "SegmentModifier": "$dt$",
                    "IFrameOnlyManifest": "EXCLUDE"
                  }
                },
                "NameModifier": "_540"
              },
              {
                "ContainerSettings": {
                  "Container": "M3U8",
                  "M3u8Settings": {
                    "AudioFramesPerPes": 4,
                    "PcrControl": "PCR_EVERY_PES_PACKET",
                    "PmtPid": 480,
                    "PrivateMetadataPid": 503,
                    "ProgramNumber": 1,
                    "PatInterval": 0,
                    "PmtInterval": 0,
                    "Scte35Source": "NONE",
                    "Scte35Pid": 500,
                    "TimedMetadata": "NONE",
                    "TimedMetadataPid": 502,
                    "VideoPid": 481,
                    "AudioPids": [
                      482,
                      483,
                      484,
                      485,
                      486,
                      487,
                      488,
                      489,
                      490,
                      491,
                      492
                    ]
                  }
                },
                "VideoDescription": {
                  "Width": 1280,
                  "ScalingBehavior": "DEFAULT",
                  "Height": 720,
                  "TimecodeInsertion": "DISABLED",
                  "AntiAlias": "ENABLED",
                  "Sharpness": 50,
                  "CodecSettings": {
                    "Codec": "H_264",
                    "H264Settings": {
                      "InterlaceMode": "PROGRESSIVE",
                      "NumberReferenceFrames": 3,
                      "Syntax": "DEFAULT",
                      "Softness": 0,
                      "GopClosedCadence": 1,
                      "GopSize": 90,
                      "Slices": 1,
                      "GopBReference": "DISABLED",
                      "SlowPal": "DISABLED",
                      "SpatialAdaptiveQuantization": "ENABLED",
                      "TemporalAdaptiveQuantization": "ENABLED",
                      "FlickerAdaptiveQuantization": "DISABLED",
                      "EntropyEncoding": "CABAC",
                      "Bitrate": 3000000,
                      "FramerateControl": "INITIALIZE_FROM_SOURCE",
                      "RateControlMode": "CBR",
                      "CodecProfile": "MAIN",
                      "Telecine": "NONE",
                      "MinIInterval": 0,
                      "AdaptiveQuantization": "HIGH",
                      "CodecLevel": "AUTO",
                      "FieldEncoding": "PAFF",
                      "SceneChangeDetect": "ENABLED",
                      "QualityTuningLevel": "SINGLE_PASS",
                      "FramerateConversionAlgorithm": "DUPLICATE_DROP",
                      "UnregisteredSeiTimecode": "DISABLED",
                      "GopSizeUnits": "FRAMES",
                      "ParControl": "INITIALIZE_FROM_SOURCE",
                      "NumberBFramesBetweenReferenceFrames": 2,
                      "RepeatPps": "DISABLED"
                    }
                  },
                  "AfdSignaling": "NONE",
                  "DropFrameTimecode": "ENABLED",
                  "RespondToAfd": "NONE",
                  "ColorMetadata": "INSERT"
                },
                "AudioDescriptions": [
                  {
                    "AudioTypeControl": "FOLLOW_INPUT",
                    "CodecSettings": {
                      "Codec": "AAC",
                      "AacSettings": {
                        "AudioDescriptionBroadcasterMix": "NORMAL",
                        "Bitrate": 96000,
                        "RateControlMode": "CBR",
                        "CodecProfile": "LC",
                        "CodingMode": "CODING_MODE_2_0",
                        "RawFormat": "NONE",
                        "SampleRate": 48000,
                        "Specification": "MPEG4"
                      }
                    },
                    "LanguageCodeControl": "FOLLOW_INPUT"
                  }
                ],
                "OutputSettings": {
                  "HlsSettings": {
                    "AudioGroupId": "program_audio",
                    "AudioRenditionSets": "program_audio",
                    "SegmentModifier": "$dt$",
                    "IFrameOnlyManifest": "EXCLUDE"
                  }
                },
                "NameModifier": "_720"
              }
            ],
            "OutputGroupSettings": {
              "Type": "HLS_GROUP_SETTINGS",
              "HlsGroupSettings": {
                "ManifestDurationFormat": "INTEGER",
                "SegmentLength": 10,
                "TimedMetadataId3Period": 10,
                "CaptionLanguageSetting": "OMIT",
                "Destination": "s3://quasar-edtech-stream/",
                "DestinationSettings": {
                  "S3Settings": {
                    "AccessControl": {
                      "CannedAcl": "PUBLIC_READ"
                    }
                  }
                },
                "TimedMetadataId3Frame": "PRIV",
                "CodecSpecification": "RFC_4281",
                "OutputSelection": "MANIFESTS_AND_SEGMENTS",
                "ProgramDateTimePeriod": 600,
                "MinSegmentLength": 0,
                "DirectoryStructure": "SINGLE_DIRECTORY",
                "ProgramDateTime": "EXCLUDE",
                "SegmentControl": "SEGMENTED_FILES",
                "ManifestCompression": "NONE",
                "ClientCache": "ENABLED",
                "StreamInfResolution": "INCLUDE"
              }
            }
          }
        ],
        "AdAvailOffset": 0,
        "Inputs": [
          {
            AudioSelectors: {
              "Audio Selector 1": {
                Tracks: [1],
                Offset: 0,
                DefaultSelection: "DEFAULT",
                SelectorType: "TRACK",
                ProgramSelection: 1,
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
            FileInput: "s3://quasaredtech-adminuploads/"+uid,
          },
        ],
      }
      
    };

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
        uploadResult();
      },
      function (err) {
        console.log("Error", err);
      }
    );
    
  };
  let uploadResult=async ()=>{
    // console.log(uid)
    let resposnse, jsonData;
        // console.log("Success ", data);
        try{
          
          resposnse = await fetch(LinkHelper.getLink()+"admin/lesson/create",{
            
            method: "POST",
            headers: {
              
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(activeLessonVideo)
            
          });
          console.log("req sent")

          // console.log(activeLessonVideo);
          try{
            jsonData = await resposnse.json();
            console.log(jsonData)
            alert("success")
          }catch(e){

          }
        }catch(err){
          console.log(err)
          alert("Something went wrong"+err.message)
        }
  }

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
            value={activeLessonVideo.title}
            onChange={(event) => {
              updateUI(event, "title");
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
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={activeLessonVideo.description}
            onChange={(event) => {
              updateUI(event, "description");
            }}
          />
          <label htmlFor="floatingInput">Description</label>
        </div>

        <>
          <button
            type="button"
            className="btn btn-primary"
            onClick={(event) => {
              // updateUI(event, "video_id");
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


