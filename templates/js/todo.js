document.getElementById("logout_button").style.visibility = "visible";
var editable_fields = document.getElementsByClassName("edit_task_data");
var todos_json = JSON.parse({{todos_json|tojson}});
var curr_todo = 0;
var todo_count = 0;
for (var i=0; i<editable_fields.length; i++) {
  if (editable_fields[i].id.indexOf("start_date") != -1 && todos_json[curr_todo]["Start date"]) {
    var start_date = todos_json[curr_todo]["Start date"].split("/");
    editable_fields[i].value = start_date[2] + "-" + start_date[1] + "-" + start_date[0];
    todo_count += 1;
  }
  if (editable_fields[i].id.indexOf("due_date") != -1 && todos_json[curr_todo]["Due date"]) {
    var due_date = todos_json[curr_todo]["Due date"].split("/");
    editable_fields[i].value = due_date[2] + "-" + due_date[1] + "-" + due_date[0];
    todo_count += 1;
  }
  if (todo_count == 2) {
    todo_count = 0;
    curr_todo += 1;
  }
}

function handle_filter () {
  var filter_selected = document.getElementById("filter_views").value;
  filter_form.submit();
}

function filter_reverse () {
  var todo_list = document.getElementById("todo_list");
  var child_count = todo_list.childElementCount;
  var todo_children = [];
  while (todo_list.firstChild) {
    if (todo_list.firstChild.nodeName == "DIV") {
      todo_children.push(todo_list.firstChild);
    }
    todo_list.removeChild(todo_list.firstChild);
  }
  for (var i=parseInt(child_count/2)-1; i>=0; i--) {
    todo_list.appendChild(todo_children[i]);
    var br = document.createElement("br");
    todo_list.appendChild(br);
  }
}

function check_date (start_date, due_date, error_panel) {
  if (start_date!="" && due_date!="") {
      if (start_date > due_date) {
          document.getElementById(error_panel).innerHTML = "Start date cannot be later than due date.";
          document.getElementById(error_panel).style.display = "inline";
          event.preventDefault();
          return false;
      }
      else {
          return true;
      }
  }
  else {
      return true;
  }
}

function create_task () {
    var start_date = document.getElementById("todo_start_date").value;
    var due_date = document.getElementById("todo_due_date").value;
    check_date(start_date, due_date, "create_task_error");
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
            tags_platform.innerHTML += "<div style='display:inline;'><span value=4 class='badge badge-primary'>\
                                        <div style='display:inline;'>"+tag.value+"</div>\
                                        &nbsp<button class='btn btn-small btn-light tag' onclick='remove_tag(this)'>\
                                        &times</button></span>&nbsp;</div>"
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

function confirm_delete_task (btn) {
  var original_btn = btn;
  while (btn.parentNode) {
    btn = btn.parentNode;
    if (btn.parentNode.getAttribute("class") == "delete_task_panel") {
      break;
    }
  }
  var id_attribute = btn.getAttribute("id");
  var char = id_attribute.split("_");
  var id = char[char.length-1];
  original_btn.setAttribute("name", id_attribute);
  original_btn.setAttribute("value", id);
  original_btn.parentNode.setAttribute("id", "delete_task_form_"+id.toString());
  document.getElementById("delete_task_form_"+id.toString()).submit();
}

function edit_task (btn) {
  var id = btn.value;
  var hidden_editable_fields = document.getElementsByClassName("hidden_editable_fields");
  for (var i=0; i<hidden_editable_fields.length; i++) {
    hidden_editable_fields[i].style.display = "inline";
  }
  var editable_fields = document.getElementsByClassName("edit_task_data");
  document.getElementById("submit_edited_" + id.toString()).style.visibility = "visible";
  document.getElementById("abandon_edited_" + id.toString()).style.visibility = "visible";
  var original_data = {};
  for (var i=0; i<editable_fields.length; i++) {
    if (editable_fields[i].id.indexOf(id) != -1) {
      original_data[editable_fields[i].id] = editable_fields[i].value;
      editable_fields[i].style.background = "beige";
      editable_fields[i].removeAttribute("readonly");
    }
  }
  window.localStorage.setItem("original_data", JSON.stringify(original_data));
}

function submit_edited (btn) {
  try {
    window.localStorage.removeItem("original_data");
  } catch (e) {}
  var id = btn.value;
  var start_date = document.getElementById("start_date_" + id.toString()).value;
  var due_date = document.getElementById("due_date_" + id.toString()).value;
  check_date(start_date, due_date, "edit_task_error_" + id.toString());
}

function abandon_task (btn) {
  var original_data = JSON.parse(window.localStorage.getItem("original_data"));
  for (var id in original_data) {
    document.getElementById(id).value = original_data[id];
  }
  window.localStorage.removeItem("original_data");
  var id = btn.value;
  document.getElementById("submit_edited_" + id.toString()).style.visibility = "hidden";
  document.getElementById("abandon_edited_" + id.toString()).style.visibility = "hidden";
  document.getElementById("edit_task_error_" + id.toString()).style.visibility = "hidden";
  for (var i=0; i<editable_fields.length; i++) {
    if (editable_fields[i].id.indexOf(id) != -1) {
      editable_fields[i].style.background = "transparent";
      editable_fields[i].setAttribute("readonly", true);
    }
  }
}
