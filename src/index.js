const { io } = require("../node_modules/socket.io/client-dist/socket.io.js");
var socket = io("https://dimetrondon-backend.onrender.com/");
var QRCode = require("qrcode");

import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

if (!Cookies.get("guid")) {
  guidStuff();
} else {
  document.getElementById("canvas").remove();
}

async function guidStuff() {
  let result = 1;
  do {
    if (Cookies.get("temp")) {
      const rawResponse = await fetch(
        "https://dimetrondon-backend.onrender.com/checkGuid",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ guid: Cookies.get("guid") }),
        }
      );

      const content = await rawResponse.json();

      result = content.total;
    } else {
      Cookies.set("temp", uuidv4());
    }
  } while (result);
  var canvas = document.getElementById("canvas");

  QRCode.toCanvas(canvas, Cookies.get("temp"), function (error) {
    if (error) console.error(error);
    console.log("success!");
    socket.on(Cookies.get("temp") + "-succes", (object) => {
      console.log("setup");
      Cookies.set("guid", Cookies.get("temp"));
    });

    socket.on(Cookies.get("temp") + "-load", (object) => {
      document.getElementById("canvas").remove();
    });
  });
}

socket.on(Cookies.get("temp") + "-display", (object) => {
  console.log(object);
  fetch(
    "https://dimetrondon-backend.onrender.com/getArtPieceToDisplay/" + object
  )
    .then((e) => e.json())
    .then((object) => {
      document.getElementById("container").innerHTML = "";

      if (object[0].genre == "Video") {
        let source = document.createElement("source");
        source.src = "https://dimetrodon.fr/files/" + object[0].file;
        source.type = "video/mp4";
        let test = document.createElement("video");
        test.classList.add("test");
        test.autoplay = true;
        test.loop = true;
        test.muted = true;
        test.load();
        test.append(source);
        document.getElementById("container").innerHTML = '';

        document.getElementById("container").appendChild(test);
      } else if (object[0].genre == "3D") {
        document.getElementById(
          "container"
        ).innerHTML = `<model-viewer class="model" src="https://dimetrodon.fr/files/${
          object[0].file
        }" poster="https://dimetrodon.fr/files/${
          object[0].file.split(".")[0]
        }.jpg" shadow-intensity="4" auto-rotate auto-rotate-delay="10" touch-action="pan-y" alt="A 3D model carousel">`;
      } else {
        let test = document.createElement("img");
        let blur = document.createElement("img");
        test.classList.add("image");
        blur.classList.add("blur");
        test.src = "https://dimetrodon.fr/files/" + object[0].file;
        blur.src = "https://dimetrodon.fr/files/" + object[0].file;
        document.getElementById("container").innerHTML = '';

        document.getElementById("container").appendChild(test);

        document.getElementById("container").appendChild(blur);
      }
    });
});
