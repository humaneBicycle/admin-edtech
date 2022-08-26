import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import LinkHelper from "../utils/LinkHelper";

export default function AllLessonArticle() {
  let location = useLocation();
  let { unit } = location.state;
  let articleInit = {
    type: "article",
    unit_id: unit.unit_id,
  };

  let [article, setArticle] = useState(articleInit);

  let handleArticleChange = (mode,e) => {
    let val = e.target.value;
    article[mode] = val;
    setArticle({ ...article});
    
  };

  let uploadArticle = async() => {
    console.log(article);
    // let response, data;
    // try {
    //   response = await fetch(LinkHelper.getLink() + "/admin/lesson/create", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(articleToUpload),
    //   });
    //   try {
    //     data = await response.json();
    //     if (data.success) {
    //       alert("Article Uploaded");
    //     } else {
    //       throw new Error(data.message);
    //     }
    //   } catch {
    //     alert("Error");
    //     console.log("error");
    //   }
    // } catch (error) {
    //   console.log(error);
    //   alert("Error");
    // }
  }

  return (
    <div>
      <>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label" >
            Title
          </label>
          <input value={article.title} className="form-control" onChange={(event)=>{handleArticleChange("title",event)}}/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">
            Head
          </label>
          <input value={article.head} className="form-control" onChange={(event)=>{handleArticleChange("head",event)}}/>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">
            Article Text
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows={9}
            defaultValue={""}
            value={article.body}
            onChange={(event)=>{handleArticleChange("body",event)}}
          />
        <button className="btn btn-primary" onClick={uploadArticle}>Submit</button>
        </div>
      </>
    </div>
  );
}
