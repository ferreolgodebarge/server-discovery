$(document).ready(function () {
    $('#btn').click(function () {
        var component = document.getElementsByClassName("component");
        for (var i = 0; i < component.length; i++) {
            var env = getEnv(component[i]);
            var host_url = env[0].attributes[1].value;
            var version_uri = env[1].attributes[1].value;
            var retries = env[2].attributes[1].value;
            console.log(get_servers(host_url, version_uri, retries));
        }
    })
})

function getEnv(component){
    var env = component.children[0].children;
    return [env[0], env[1], env[2]]
}

function get_servers(host_url, version_uri, retries) {
    var url = host_url + version_uri;
    var list = [];
    for (var i = 0; i < retries; i++) {
        request_version(url, list);
    }
    return list;
}

function request_version(url, list) {
    $.ajax({
        url: url,
        type: "GET",
        success: function (result) {
            console.log("send")
            if (isNew(result, list)) {
                list.push(result);
            }
        },
        error: function (error) {
            console.log(`Error ${error}`);
        }
    });
}

function isNew(element, list) {
    res = true;
    list.forEach(function (item) {
        var samePackage = item.package_version == element.package_version;
        var sameHostname = item.hostname == element.hostname;
        if (samePackage && sameHostname) {
            res = false;
        }
    })
    return res;
}