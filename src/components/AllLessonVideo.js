import React, { useEffect, useState } from "react";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";
import MediaConvert from "aws-sdk/clients/mediaconvert";
import LinkHelper from "../utils/LinkHelper";
import { useLocation } from "react-router";
import StorageHelper from "../utils/StorageHelper";
import Loader from "../components/Loader";
import SnackBar from "../components/snackbar";
var videoFile;

let uid;
let credentials;

let videoUId;
let thumbnailFile;
let thimbnailUId;
export default function AllLessonVideo(props) {
  let [hasPrerequisite, setHasPrerequisite] = useState(true);
  let [progress, setProgress] = useState(-1);
  const location = useLocation();
  let { unit } = location.state;
  let lessons = props.lessons;
  credentials = props.awsCredentials;
  let [isAWSLoaded, setisAWSLoaded] = useState(true);
  // useEffect(() => {
  //   getAWSCredentials();
  // }, []);

  // let getAWSCredentials = async () => {
  //   let response, data;
  //   try {
  //     response = await fetch(LinkHelper.getLink() + "admin/aws/read", {
  //       method: "POST",
  //       headers: {
  //         authorization: "Bearer " + StorageHelper.get("token"),
  //         "content-type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         admin_id: StorageHelper.get("admin_id"),
  //       }),
  //     });
  //     try {
  //       data = await response.json();

  //       if (data.success) {
  //         console.log(data);
  //         setisAWSLoaded(true);
  //       } else {
  //         setisAWSLoaded(false);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       setisAWSLoaded(false);
  //     }
  //   } catch (err) {
  //     console.log("error", err);
  //     setisAWSLoaded(false);
  //   }
  // };

  let [activeLessonVideo, setActiveLessonVideo] = useState({
    admin_id: StorageHelper.get("admin_id"),
    type: "video",
    unit_id: unit.unit_id,
    prerequisite: {
      has_prerequisite: true,
    },
    completion: "auto"
  });

  let updateUI = (e, mode) => {
    let val;
    if (mode !== "video_id") {
      val = e.target.value;
    }

    if (mode === "video") {
      videoFile = e.target.files[0];
      activeLessonVideo[mode] = videoFile;
      uid = "id" + new Date().getTime();
      videoUId = uid + videoFile.name.split(".").pop();
      setActiveLessonVideo({ ...activeLessonVideo, video_id: uid });
    } else {
      activeLessonVideo[mode] = val;

      setActiveLessonVideo({ ...activeLessonVideo });
    }
  };
  let prerequisiteItemClick = (e, lesson) => {
    console.log(lesson);
    setActiveLessonVideo({
      ...activeLessonVideo,
      prerequisite: { ...activeLessonVideo.prerequisite, on: lesson._id },
    });
    console.log(activeLessonVideo);
  };

  let addLesson = async (event, lesson) => {
    event.preventDefault();
    if (
      lesson.video == null ||
      lesson.thumbnail_url === undefined ||
      lesson.title === undefined ||
      lesson.description === undefined ||
      activeLessonVideo.prerequisite.has_prerequisite
    ) {
      if (activeLessonVideo.prerequisite.has_prerequisite) {
        if (
          activeLessonVideo.prerequisite.on === undefined ||
          activeLessonVideo.prerequisite.time === undefined ||
          activeLessonVideo.prerequisite.message === undefined
        ) {
          // alert("Please fill all the fields");
          SnackBar("Please fill all the fields", 1000, "OK")
          return;
        }
      } else {
        // alert("Please fill all the fields");
        SnackBar("Please fill all the fields", 1000, "OK")
        return;
      }
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
      "Settings": {
        "Inputs": [
          {
            "VideoSelector": {},
            "AudioSelectors": {
              "Audio Selector 1": {
                "DefaultSelection": "DEFAULT"
              }
            },
            "VideoGenerator": {}
          }
        ],
        "OutputGroups": [
          {
            "Name": "Apple HLS",
            "OutputGroupSettings": {
              "Type": "HLS_GROUP_SETTINGS",
              "HlsGroupSettings": {
                "SegmentLength": 10,
                "MinSegmentLength": 0
              }
            },
            "Outputs": [
              {
                "NameModifier": "1080p",
                "Preset": "System-Avc_16x9_1080p_29_97fps_8500kbps"
              }
            ]
          },
          {
            "Name": "Apple HLS",
            "OutputGroupSettings": {
              "Type": "HLS_GROUP_SETTINGS",
              "HlsGroupSettings": {
                "SegmentLength": 10,
                "MinSegmentLength": 0
              }
            },
            "Outputs": [
              {
                "NameModifier": "720",
                "Preset": "System-Avc_16x9_720p_29_97fps_3500kbps"
              }
            ]
          },
          {
            "Name": "Apple HLS",
            "OutputGroupSettings": {
              "Type": "HLS_GROUP_SETTINGS",
              "HlsGroupSettings": {
                "SegmentLength": 10,
                "MinSegmentLength": 0
              }
            },
            "Outputs": [
              {
                "Preset": "System-Avc_16x9_540p_29_97fps_3500kbps"
              }
            ]
          },
          {
            "Name": "Apple HLS",
            "OutputGroupSettings": {
              "Type": "HLS_GROUP_SETTINGS",
              "HlsGroupSettings": {
                "SegmentLength": 10,
                "MinSegmentLength": 0
              }
            },
            "Outputs": [
              {
                "Preset": "System-Avc_4x3_360p_14_99fps_400kbps"
              }
            ]
          },
          {
            "Name": "Apple HLS",
            "OutputGroupSettings": {
              "Type": "HLS_GROUP_SETTINGS",
              "HlsGroupSettings": {
                "SegmentLength": 10,
                "MinSegmentLength": 0
              }
            },
            "Outputs": [
              {
                "Preset": "System-Avc_16x9_270p_14_99fps_400kbps"
              }
            ]
          }
        ],
        "TimecodeConfig": {
          "Source": "ZEROBASED"
        }
      },
      "Role": "arn:aws:iam::927103216175:role/service-role/MediaConvert_Default_Role",
      "Queue": "arn:aws:mediaconvert:us-east-1:927103216175:queues/Default"
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
  let uploadResult = async () => {
    // console.log(uid)
    let resposnse, jsonData;
    console.log("Success ", activeLessonVideo);
    try {
      resposnse = await fetch(LinkHelper.getLink() + "admin/lesson/create", {
        method: "POST",
        headers: {
          authorization: "Bearer " + StorageHelper.get("token"),

          "Content-Type": "application/json",
        },
        body: JSON.stringify(activeLessonVideo),
      });
      console.log("req sent");

      // console.log(activeLessonVideo);
      try {
        jsonData = await resposnse.json();
        if (jsonData.succuss) {
          // alert("success");

          SnackBar("Success", 1800, "OK")
        }
        console.log("response", jsonData);
      } catch (e) {
        console.log(e);
      }
    } catch (err) {
      console.log(err);
      // alert("Something went wrong" + err.message);
      SnackBar("Something went wrong" + err.message, 1800, "OK")

    }
  };

  return (
    <>
      {isAWSLoaded ? (
        <>
          <>
            {progress !== -1 ? (
              <Loader />
            ) : (
              <></>
            )}
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
                type="file"
                value={activeLessonVideo.thumbnail_url}
                onChange={(event) => {
                  updateUI(event, "thumbnail_url");
                }}
              />
              <label htmlFor="floatingInput">Thumbnail</label>
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
            <div className="d-flex align-items-center justify-content-start p-2 mb-2 flex-wrap">
              <div className="form-check me-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  onChange={() => {
                    setActiveLessonVideo({
                      ...activeLessonVideo,
                      completetion: "manual",
                    });
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Completion Manual
                </label>
              </div>
              <div className="form-check me-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  defaultChecked="true"
                  onChange={() => {
                    setActiveLessonVideo({
                      ...activeLessonVideo,
                      completion: "auto",
                    });
                  }}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Completion Auto
                </label>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="flexSwitchCheckChecked"
                  defaultChecked="true"
                  onChange={(event) => {
                    // article.prerequisite.has_prerequisite=!hasPrerequisite
                    setActiveLessonVideo({
                      ...activeLessonVideo,
                      prerequisite: {
                        ...activeLessonVideo.prerequisite,
                        has_prerequisite: !hasPrerequisite,
                      },
                    });
                    setHasPrerequisite(!hasPrerequisite);
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckChecked"
                  checked
                >
                  Has Pre-requisites
                </label>
              </div>
            </div>
            <div className="prerequisites">

              {hasPrerequisite ? (
                <>
                  <>
                    <div className="dropdown">
                      <button
                        className="btn btn-primary btn-sm dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-mdb-toggle="dropdown"
                        aria-expanded="false"
                      >
                        On Lesson
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        {lessons.length !== 0 ? (
                          lessons.map((lesson) => {
                            return (
                              <li className="dropdown-item"
                                onClick={(e) => {
                                  prerequisiteItemClick(e, lesson);
                                }}
                              >
                                {lesson.title}
                              </li>
                            );
                          })
                        ) : (
                          <li>No Lessons Found. Can't set Prerequisite</li>
                        )}
                      </ul>
                    </div>
                    <div className="d-flex align-items-center justify-content-between p-2 mb-2 flex-wrap">
                      <div className="form-floating me-2">

                        <input
                          id="inputPassword5"
                          className="form-control"
                          placeholder="Enter The Time"
                          type="number"
                          value={activeLessonVideo.prerequisite.time}
                          onChange={(event) => {
                            setActiveLessonVideo({
                              ...activeLessonVideo,
                              prerequisite: {
                                ...activeLessonVideo.prerequisite,
                                time: event.target.value,
                              },
                            });
                          }}
                        />
                        <label htmlFor="inputPassword5" className="form-label">
                          After Time in Seconds
                        </label>
                      </div>
                      <div className="form-floating me-2">

                        <input
                          id="inputPassword5"
                          className="form-control"
                          placeholder="Enter the Message"
                          value={activeLessonVideo.prerequisite.message}
                          onChange={(event) => {
                            setActiveLessonVideo({
                              ...activeLessonVideo,
                              prerequisite: {
                                ...activeLessonVideo.prerequisite,
                                message: event.target.value,
                              },
                            });
                          }}
                        />   <label htmlFor="inputPassword5" className="form-label">
                          Prerequisite Message
                        </label>
                      </div>
                    </div>
                  </>
                </>
              ) : (
                <></>
              )}
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
        </>
      ) : (
        <>
          <div className="d-flex">
            <div
              className="spinner-grow text-primary m-auto  my-5"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
