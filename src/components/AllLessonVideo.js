import React, { useState } from "react";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client, S3 } from "@aws-sdk/client-s3";


var videoFile;

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
  
  let addLesson = async(event,lesson) => {
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
    
    
    
  }
  let uploadVideo = async (video) => {
    let credentials = {
      accessKeyId: "AKIA5PW5INIXWXZXRC2D",
      secretAccessKey: "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",
    };
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
        console.log("progress",progress);
        setProgress(progress);
      });
  
      await parallelUploads3.done();
      setProgress(-1);
      mediaConvertService(uid);
    } catch (e) {
      console.log(e);
    }
  }

  let mediaConvertService = async (uid) => {
    console.log("making diff quality vid now for uid "+uid);

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


