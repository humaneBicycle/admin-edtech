import React from 'react'
import { useLocation } from 'react-router-dom';

export default function 
UpdateLessonVideo() {
    let [state,setState]=React.useState({
        spinner:false,
        activeLessonVideo:useLocation().state.lesson,

    })
  return (
    <div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={state.activeLessonVideo.title}
            onChange={(event) => {
              setState({...state,activeLessonVideo:{...state.activeLessonVideo,title:event.target.value}})
            }}
          />

          <label htmlFor="floatingInput">Title</label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com"
            value={state.activeLessonVideo.title}
            onChange={(event) => {
                setState({...state,activeLessonVideo:{...state.activeLessonVideo,title:event.target.value}})

            }}
          />

          <label htmlFor="floatingInput">Title</label>
        </div>
    </div>
  )
}
