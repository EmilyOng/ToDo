document.getElementById("logout_button").style.visibility = "visible";
function create_task () {
    var start_date = document.getElementById("todo_start_date").value;
    var due_date = document.getElementById("todo_due_date").value;
    if (start_date!="" && due_date!="") {
        if (start_date > due_date) {
            document.getElementById("create_task_error").innerHTML = "Start date cannot be later than due date.";
            document.getElementById("create_task_error").style.visibility = "visible";
            event.preventDefault();
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function track_tags () {
    var key = event.key;
    var tags_platform = document.getElementById("tags_platform");
    var todo_tag = document.getElementById("track_todo_tags");

    if (key == "Enter") {
        event.preventDefault();
        var tag = document.getElementById("todo_tag");
        tag.value = tag.value.replace(",", "");
        var index = todo_tag.value.indexOf(tag.value);
        if (index == -1) {
            tags_platform.innerHTML += "<div style='display:inline;'><span value=4 class='badge badge-primary'>"+
                                        "<div style='display:inline;'>"+tag.value+"</div>"+
                                        "&nbsp<button class='btn btn-small btn-light tag' onclick='remove_tag(this)'>"+
                                        "&times</button></span>&nbsp;</div>"
            todo_tag.value += tag.value + ",";
        }
        tag.value = "";
    }
}

function remove_tag (tag) {
    event.preventDefault();
    var root = tag.parentNode.parentNode;
    var tag_value = root.children[0].children[0].textContent;
    var todo_tag = document.getElementById("track_todo_tags");
    todo_tag.value = todo_tag.value.replace(tag_value, "");
    root.parentNode.removeChild(root);
}

function clear_tag (tag) {
    event.preventDefault();
    var root = tag.parentNode.parentNode;
    var tag_value = root.children[0].children[0].textContent;
    var delete_tag = document.getElementById("delete_tag");
    delete_tag.value = tag_value;
    var can_delete_tag = true;
    var todos_json = JSON.parse({{todos_json|tojson}});
    for (var i = 0; i < todos_json.length; i ++) {
        for (var j = 0; j < todos_json[i]["Tag"].length; j ++) {
            if (todos_json[i]["Tag"][j] == tag_value) {
                can_delete_tag = false;
                var notification = document.getElementById("notification");
                notification.innerHTML = "<div class='alert alert-danger alert-dismissible'>" +
                                        "<a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" +
                                        "Tag cannot be deleted as it is currently being used.</div>";
                break;
            }
        }
    }
    if (can_delete_tag) {
        root.parentNode.removeChild(root);
        delete_tag.click();
    }
}