/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, jQuery*/

var clarifaiToken = "";

function getClarifaiToken() {
    $.ajax({
        datatype: "json",
        type: "POST",
        async: false,
        url: "https://api.clarifai.com/v1/token/",
        data: {
            "client_id": "st1eTB4UOp81wz5FJdm4DawNU72b2RR_kMWeirDz",
            "client_secret": "7aKHHWZCnQTS0iaRcVPb-PTDXvOCr3rnpn-B9iO7",
            "grant_type": "client_credentials"
        },
        success: function (data) {
            console.log(data);
            clarifaiToken = data.access_token;
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function getImageTags(srcUrl) {
    var dataDump = [];
    var newToken = "Bearer " + clarifaiToken;
    $.ajax({
        type: "POST",
        url: "https://api.clarifai.com/v1/tag/",
        headers : {
            "Authorization": newToken
        },
        data: {
            "url": srcUrl
        },
        success: function (data) {
            console.log(data.results[0].result.tag.classes);
            dataDump = data.results;
        },
        error: function (data) {
            console.log(data);
        }
    });
    return dataDump;

}
/*
function tag_it(url) {
    var dataJson = {'encoded_data' : url};
    $.ajax({
        datatype: 'json',
        type: 'POST',
        url: 'https://api.clarifai.com/v1/tag/',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'bearer ' + 'eUcqRh2Cp67ONu9dwploD8313khZ8g');
        },
        data: dataJson,
        success: function (data_2) {
            console.log(data_2);
        },
        error: function (data_2) {
            console.log(data_2);
        }
        
        
        
    });
}

function tag(url) {
    var dataJson = {'url' : url};
    $.ajax({
        url: 'https://api.clarifai.com/v1/tag/',
        type: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'bearer ' + "4ndNXsmIburi52MAXwsfjqWBF31Ohw");
        },
        data: dataJson,
        dataType: 'json',
        success: function (object) {
            $.each(object.results, function (curr, results) {
                var tags = results.result.tag.classes;
                var htmlAlt = "<p>";
                $.each(tags, function (curr2, tag) {
                    htmlAlt += tag + " ";
                });
                htmlAlt += "</p><img src='" + url + "' width='200px'>";
                $("#tags").html(htmlAlt);
            });
            console.log(object);
            console.log("success!");
            return;
        },
        error: function (err) {
            console.log("fail: ajax");
            console.log(err);
            return;
        }
    });
}

function getClarifaiData(sourceURL) {
    var tags;
    $.ajax({
        Datatype: "json",
        type: "POST",
        url: "https://api.clarifai.com/v1/tag/",
        headers: {
            Authorization: "Bearer " + JSON.stringify(clarifaiToken)
        },
        data: {
            url: sourceURL
        },
        sucess: function (data) {
            console.log(data.results);
            tags = data;
        },
        error: function (data) {
            console.log(data);
        }
    });
    return tags;
}
*/
function getImageTags() {
    var OG_images = document.getElementsByTagName("img");
    var GIF_images = [OG_images.length];
    var i = 0;
    for (i; i < OG_images.length; i++) {
        if (OG_images[i].src !== "") {
            GIF_images[i] = [true, OG_images[i].src];
        } else if (OG_images[i].dataset.src !== "") {
            GIF_images[i] = [true, OG_images[i].dataset.src];
        } else {
            GIF_images[i] = [false, "myspace"];
        }
        
        
        if (GIF_images[i][1].substring(0, 4).toLowerCase() !== "http") {
            GIF_images[i] = [false, "myspace"];
        }
        
        
        if (GIF_images[i][0] === true) {
            GIF_images[i][2] = getImageTags(GIF_images[i][1]);
        }
    }
    

}

$(function () {
    console.log("ready!");
    getClarifaiToken();
    getImageTags();
});