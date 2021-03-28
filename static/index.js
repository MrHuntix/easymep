let projects = [];
let projectList = null;
let projectDetails = null;
//./chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
let baseUrl = `http://ec2-13-234-75-74.ap-south-1.compute.amazonaws.com:3100/client/`;

let settings = {
    "url": `client/`,
    "method": "GET",
    "timeout": 0,
    "headers": {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InB1bmVldGgiLCJpYXQiOjE2MDY4NDcxNTJ9.A-1MfTqDxSgqm-5_Js4m3SBrb8du2-csMC-Er-h022s",
    },
};

let sseSource = new EventSource(`client/delta/`);

sseSource.onopen = function () {
    console.log('sse opened');
}

sseSource.onerror = function (err) {
    console.log(`sse error ${err.eventPhase}`);
}

sseSource.onmessage = function (event) {
    console.log(`event data ${JSON.parse(event.data)}::${projects.length}`);
    projects.push(JSON.parse(event.data));
    if (projects.length == 1) {
        updateDetails(projectDetails === null ? $("#details") : projectDetails, 0);

    } else {
        console.log(`added a new project::${projects.length}`);
    }
    let latestProject = projects[projects.length - 1];
    var caroselItem = $(`<div id=${["app_name"]}></div>`);
    if (projects.length === 1)
        caroselItem.addClass("carousel-item active");
    else
        caroselItem.addClass("carousel-item");
    var caroselCaption = $('<div class="card bg-secondary"></div>');
    var heading = $(`<div class="card-header caption"><h3>${latestProject["app_name"]}</h3></div>`);
    var description = $(`<div class="card-body caption"><p>${latestProject["description"]}</p></div>`);
    // var button = $("<button>details</button>");
    caroselCaption.append(heading, description);
    caroselItem.append(caroselCaption);
    projectList.append(caroselItem);
}

let display = (index) => {
    let project = projects[index];
    console.log(project);
};

$(document).ready(function () {
    projectList = $("#projectList");
    projectDetails = $("#details");

    $.ajax(settings).done(function (response) {
        console.log(response);
        if (response != null && response["apps"].length > 0) {
            projects = response["apps"];
            console.log(projects);
            updateDetails(projectDetails, 0);
            projects.forEach((project, index) => {
                var caroselItem = $(`<div id=${project["app_name"]}></div>`);
                if (index === 0)
                    caroselItem.addClass("carousel-item active");
                else
                    caroselItem.addClass("carousel-item");
                var caroselCaption = $('<div class="card bg-secondary"></div>');
                var heading = $(`<div class="card-header caption"><h3>${project["app_name"]}</h3></div>`);
                var description = $(`<div class="card-body caption"><p>${project["description"]}</p></div>`);
                // var button = $("<button>details</button>");
                caroselCaption.append(heading, description);
                caroselItem.append(caroselCaption);
                projectList.append(caroselItem);
            });
        } else {
            projectDetails.empty();
            projectDetails.append(`<p class="lead">There are no projects available</p>`);
        }
    });



    $(window).scroll(function () {
        if ($(window).scrollTop() > 10) {
            $("#myNavBar").removeClass("bg-transparent").addClass("bg-dark");
        } else {
            $("#myNavBar").removeClass("bg-dark").addClass("bg-transparent");
        }
    });

    $("#demo").on('slide.bs.carousel', function (event) {
        updateDetails(projectDetails, event.to);
    });
});

function updateDetails(element, index) {
    let project = projects[index];
    element.empty();
    element.append(`<p class="lead">${project["app_name"]}<br/>${project["description"]}</p><br/>`);
    element.append(`<p class="lead">Tech Stack: ${project["languages"]}</p><br/>`);
    element.append(`<p class="lead">Links: <a href="${project["git_url"]}" data-toggle="tooltip" title="open in github">github</a>${project["live_url"] == "no" ? '' : ` | <a href="${project["live_url"]}" data-toggle="tooltip" title="try the live version">link</a>`}</p>`)

}