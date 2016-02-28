function Space(ratio, imageurl) {
  this.ratio = ratio;
  this.imageurl = imageurl;
}

var token = "";

var getSpace = {
  init: function(mySpace) {
    this.mySpace = mySpace;
  },

  horizontal: function() {
    return this.mySpace.filter(function(mySpace) {
      return mySpace.ratio === "horizontal";
    });
  },

  vertical: function() {
    return this.mySpace.filter(function(mySpace) {
      return mySpace.ratio === "vertical";
    });
  },

  square: function() {
    return this.mySpace.filter(function(mySpace) {
      return mySpace.ratio === "square";
    });
  }
};

function Randomize(images) {
  return Math.floor(Math.random() * images.length)
}

function background() {
  $("*").each(function(img) {
    bgUrl = $(this).css("background-image");
    if (bgUrl && bgUrl != "none") {
      bgUrl = bgUrl.match(/\((.*?)\)/)[1].replace(/('|")/g, '');
      filterDiv($(this), bgUrl);
    }
  });
}

var mySpace = [
  new Space("horizontal", "https://media.giphy.com/media/uzUkuJWIPKu5i/giphy.gif"),
  new Space("horizontal", "https://media.giphy.com/media/6O6sVzJm1hhWE/giphy.gif"),
  new Space("horizontal", "https://media.giphy.com/media/seRWjH5VfmKL6/giphy.gif"),
  new Space("horizontal", "https://media.giphy.com/media/WbfcrrqkbScCs/giphy.gif"),
  new Space("horizontal", "https://media.giphy.com/media/3oEdv4KI5EFw41QR32/giphy.gif"),
  new Space("horizontal", "https://media.giphy.com/media/vADygL41DguGc/giphy.gif"),
  new Space("vertical", "https://media.giphy.com/media/p9MoqkmWR6YvK/giphy.gif"),
  new Space("vertical", "https://media.giphy.com/media/p9MoqkmWR6YvK/giphy.gif"),
  new Space("vertical", "https://media.giphy.com/media/L8x0bwLbTFqcE/giphy.gif"),
  new Space("vertical", "https://media.giphy.com/media/VgQFZPelz4wcE/giphy.gif"),
  new Space("vertical", "https://media.giphy.com/media/NLYFwCqyAiCyY/giphy.gif"),
  new Space("square", "https://media.giphy.com/media/pvp70AFTNjYxW/giphy.gif"),
  new Space("square", "https://media.giphy.com/media/2Cu9UEfURuB5m/giphy.gif"),
  new Space("square", "https://media.giphy.com/media/CVkqVRbLDT37G/giphy.gif"),
  new Space("square", "https://media.giphy.com/media/fVBJqTToFse3u/giphy.gif"),
  new Space("square", "https://media.giphy.com/media/11TqyLDxgitT4Q/giphy.gif")
]

var visitedImages = {
  "https://media.giphy.com/media/uzUkuJWIPKu5i/giphy.gif": false,
  "https://media.giphy.com/media/6O6sVzJm1hhWE/giphy.gif": false,
  "https://media.giphy.com/media/seRWjH5VfmKL6/giphy.gif": false,
  "https://media.giphy.com/media/WbfcrrqkbScCs/giphy.gif": false,
  "https://media.giphy.com/media/3oEdv4KI5EFw41QR32/giphy.gif": false,
  "https://media.giphy.com/media/vADygL41DguGc/giphy.gif": false,
  "https://media.giphy.com/media/p9MoqkmWR6YvK/giphy.gif": false,
  "https://media.giphy.com/media/p9MoqkmWR6YvK/giphy.gif": false,
  "https://media.giphy.com/media/L8x0bwLbTFqcE/giphy.gif": false,
  "https://media.giphy.com/media/VgQFZPelz4wcE/giphy.gif": false,
  "https://media.giphy.com/media/NLYFwCqyAiCyY/giphy.gif": false,
  "https://media.giphy.com/media/pvp70AFTNjYxW/giphy.gif": false,
  "https://media.giphy.com/media/2Cu9UEfURuB5m/giphy.gif": false,
  "https://media.giphy.com/media/CVkqVRbLDT37G/giphy.gif": false,
  "https://media.giphy.com/media/fVBJqTToFse3u/giphy.gif": false,
  "https://media.giphy.com/media/11TqyLDxgitT4Q/giphy.gif": false

}


function isBLAH(tags) {
  var numTags = Math.min(tags.length, 15);
  for (var i = 0; i < numTags; i++) {
    return true;
  };

  return false;
}

function loadSpaceImage(image) {
  var ratio = imageRatio(image);
  var number = Randomize(getSpace[ratio]());
  return getSpace[ratio]()[number].imageurl;
}

function filterImage(img) {
  var authbearer = "Bearer " + token;
  $.ajax({
    headers: {
      "Authorization": authbearer
    },
    type: "POST",
    url: "https://api.clarifai.com/v1/tag/",
    data: {
      "url": img.src
    },
    success: function(data) {
      console.log(data);
      if (isBLAH(data.results[0].result.tag.classes)) {
        console.log(img.src);
        visitedImages[img.src] = true;
        img.src = loadSpaceImage(img);
      } else {
        visitedImages[img.src] = false;
      }
    },
    error: function(data) {
      console.log(data);
    }

  });
}

function imageRatio(image) {
  var proportion = image.height / image.width;

  if (proportion > 1.1) {
    return "vertical";
  } else if (proportion < 0.9) {
    return "horizontal";
  } else {
    return "square";
  }
}

function fetchApiToken(image) {
  $.ajax({

    type: "POST",
    dataType: "json",
    url: "https://api.clarifai.com/v1/token/",
    data: {
      "client_id": "st1eTB4UOp81wz5FJdm4DawNU72b2RR_kMWeirDz",
      "client_secret": "7aKHHWZCnQTS0iaRcVPb-PTDXvOCr3rnpn-B9iO7",
      "grant_type": "client_credentials"
    },
    async: false,
    success: function(data) {
      console.log(data);
      token = data.access_token;
    },
    error: function(data) {
      console.log(data);
    }

  });
}

(function(document) {

  test = function() {
    var images = document.getElementsByTagName('img')
    var length = images.length
    for (var i = 0; i < length; i++) {

      // is cached yet?
      if (!(images[i].src in visitedImages)) {
        if (images[i].height > 75 && images[i].width > 75) {
          filterImage(images[i]);
        };
      } else if (visitedImages[images[i].src]) {
        images[i].src = loadSpaceImage(images[i]);
      }
      // var number = Randomize(getSpace[ratio]());
    }
  }

  getSpace.init(mySpace);

  fetchApiToken();
  test();
  setInterval(test, 3000);
})(document);
