// SnackBar


export default function SnackBar(SnackBarBody, SnackBarDuration=3000, actionButton = "OK") {
    let SnackBarContainer = document.querySelector(".snackBar-container");
    if (SnackBarContainer === null || SnackBarContainer === undefined) {

        document.querySelector("body").insertAdjacentHTML("beforeend", '<div class="snackBar-container"></div>');
        SnackBarContainer = document.querySelector(".snackBar-container");
    }
    let SnackBarStyle = document.querySelector("#forSnackBar");
    if (SnackBarStyle === null || SnackBarStyle === undefined) {

        document.head.insertAdjacentHTML("beforeend", `<style id='forSnackBar'>.snackBar-container{display: flex;flex-direction: column;align-content: flex-end;position:fixed;z-index:99999;bottom:calc(3rem - 2px);right:calc(1.5rem - 1px);width:auto;height:auto;max-width:25rem}.snackBar-container>.snackBar{z-index:99999;width:100%;max-width:300px;min-width:180px;border-radius:calc(0.75rem - 1px);margin-block:0.5rem;margin-inline-end:0.5rem;margin-inline-start:auto;padding:1rem;display:inline-flex;justify-content:space-between;align-items:center;font-weight:500;transition:all .5s cubic-bezier(0.175,0.885,0.22,1.775);background: #000000db;color: #e8f9ffc9;backdrop-filter:blur(0.3rem);box-shadow:1.7px 3.1px 9.9px -47px rgba(0,0,0,0.07),11.9px 21.3px 27.3px -47px rgba(0,0,0,0.057),15.4px 27.7px 65.7px -47px rgba(0,0,0,0.046),15px 27px 218px -47px rgba(0,0,0,0.04);transform:translateY(1rem);opacity:0;visibility:hidden}.snackBar-container>.snackBar.show{transform:translateY(0);opacity:1;visibility:visible}.snackBar-container>.snackBar>button{display:inline-block;outline:0;border:0;border-radius:0.5rem;text-transform:uppercase;font-weight:600;font-size:1rem;background:none;color:#149eca;margin-inline:auto 0.1rem}</style>`)

    }

    var SnackBar = document.createElement("div");
    SnackBar.classList.add("snackBar");
    SnackBar.innerText = SnackBarBody;
    if (actionButton !== "") {
        var snackBarCloseBtn = document.createElement("button");
        snackBarCloseBtn.type = "button";
        snackBarCloseBtn.innerText = actionButton;
        SnackBar.appendChild(snackBarCloseBtn);
        snackBarCloseBtn.onclick = function () {
            SnackBar.classList.remove("show");
            setTimeout(function () {
                SnackBar.remove();
            }, 350);
        }
    }


    SnackBarContainer.appendChild(SnackBar);
    // wait just a bit to add active class to the message to trigger animation
    setTimeout(function () {
        SnackBar.classList.add("show");
    }, 1);

    // Setting Up Durations
    if (SnackBarDuration > 0) {
        // it it's bigger then 0 add it
        setTimeout(function () {
            SnackBar.classList.remove("show");
            setTimeout(function () {
                SnackBar.remove();
            }, 350);
        }, SnackBarDuration);
    } else if (SnackBarDuration == null) {
        //  it there isn't any add default one (3000ms)
        setTimeout(function () {
            setTimeout(function () {
                SnackBar.classList.remove("show");
                SnackBar.remove();
            }, 350);
        }, 3000);
    }
}