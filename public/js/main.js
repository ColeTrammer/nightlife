$(document).ready(() => {
    const cachedLocation = $("#location").val();
    if (cachedLocation) {
        $("#location").val(cachedLocation);//to prevent form values being cached(make sure the form is displayed properly)
        search();
    }

    $("#search").click(search);
});

function search(e) {
    const location = $("#location").val();
    if (!IS_LOGGED_IN) {
        $("#message").html("<h3>Click on the bar to mark yourself as going to it. You must login to do it though.</h3>");
    }
    if (location) {
        $.getJSON(`/api/search?location=${location}`, (data) => {
            $("#results").html("");
            data.forEach((bar) => {
                addBar(bar);
            });
        });
    }
    if (e)
        e.preventDefault();
}

function addBar(bar) {
    $("#results").append(`<a id=${bar.id} class="list-group-item list-group-item-action ${IS_LOGGED_IN ? "" : "disabled"}"><h1>${bar.name} <small id="${bar.id}-p"></small></h1><div class="row"><div class="col-md-6" id="${bar.id}-img"><img width="200" height="200" src="${bar.image_url}"></div></div></a>`);
    if (IS_LOGGED_IN)
        if (!bar.going) {
            allowAddUser(bar);
        } else {
            allowRemoveUser(bar);
            unallowAddUser(bar);//default state of disabled is allowing add user
        }
}

function unallowRemoveUser(bar) {
    $(`#${bar.id}-unmark`).off();
    $(`#${bar.id}`).toggleClass("disabled");
}

function unallowAddUser(bar) {
    $(`#${bar.id}`).off();
    $(`#${bar.id}`).toggleClass("disabled");
}

function allowRemoveUser(bar) {
    $(`#${bar.id}-p`).html(`People going: ${bar.usersGoing} You are marked as going to this bar. <a id="${bar.id}-unmark">Unmark yourself as going.</a>`);
    $(`#${bar.id}-unmark`).click((e) => {
        $.getJSON(`/api/remove_user/${bar.id}`, (data) => {
            if (data.success) {
                updateUsersGoingBy(bar, -1);
                allowAddUser(bar);
                unallowRemoveUser(bar);
            } else {
                console.log(data);
            }
        });
    });
}

function allowAddUser(bar) {
    $(`#${bar.id}-p`).html(`People going: ${bar.usersGoing}`);
    $(`#${bar.id}`).click((e) => {
        $.getJSON(`/api/add_user/${bar.id}`, (data) => {
            if (data.success) {
                updateUsersGoingBy(bar, 1);
                allowRemoveUser(bar);
                unallowAddUser(bar);
            } else {
                console.log(data);
            }
        })
    });
}

function updateUsersGoingBy(bar, amount) {
    bar.usersGoing += amount;
}
