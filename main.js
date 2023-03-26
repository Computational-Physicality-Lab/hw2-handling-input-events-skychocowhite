// NOTE: The variable "shirts" is defined in the shirts.js file as the full list of shirt offerings
//       You can access this variable here, and should use this variable here to build your webpages

let initProducts = () => {
  // To see the shirts object, run:
  // console.log(shirts);

  // Your Code Here
  let shirtsList = document.getElementsByClassName("shirtsList")[0];
  for (const shirt of shirts) {
    /* Check shirt information is valid */
    if (shirt.name === undefined || shirt.price === undefined || shirt.description === undefined) {
      continue;
    }

    /* Shirt element */
    let shirtGrid = document.createElement("div");
    shirtGrid.setAttribute("class", "shirt");

    /* Shirt image */
    let anchor = document.createElement("a");
    anchor.setAttribute("href", `details.html?name=${shirt.name}`);
    anchor.setAttribute("target", "_self");

    let shirtImage = document.createElement("img");
    let imageLink = "shirt_images/not-found.png";
    if (shirt.default.front !== undefined) {
      imageLink = shirt.default.front;
    } else if (shirt.colors !== undefined) {
      for (const color of Object.keys(shirt.colors)) {
        if (shirt.colors[color].front !== undefined) {
          imageLink = shirt.colors[color].front;
          break;
        }
      }
    }
    shirtImage.setAttribute("src", imageLink);
    shirtImage.setAttribute("alt", "A t-shirt");
    anchor.appendChild(shirtImage);
    shirtGrid.appendChild(anchor);

    /* Shirt name and description */
    let p = document.createElement("p");
    p.setAttribute("class", "shirtName");
    p.appendChild(document.createTextNode(shirt.name));
    shirtGrid.appendChild(p);

    p = document.createElement("p");
    p.setAttribute("class", "shirtColorCounts");
    if (Object.keys(shirt.colors).length === 0) {
      p.appendChild(document.createTextNode("There is no available shirts right now"));
    } else if (Object.keys(shirt.colors).length === 1) {
      p.appendChild(document.createTextNode("Available in 1 color"));
    } else {
      p.appendChild(document.createTextNode(`Available in ${Object.keys(shirt.colors).length} colors`));
    }
    shirtGrid.appendChild(p);

    /* Quick View and See Page buttons */
    let div = document.createElement("div");
    div.setAttribute("class", "shirtButtons");

    anchor = document.createElement("a");
    anchor.setAttribute("id", "quickViewButton");
    anchor.appendChild(document.createTextNode("Quick View"));

    anchor.addEventListener("click", function () {
      let section = document.getElementsByClassName("quickView")[0];
      section.style.display = "flex";

      /* Set quick view block */
      /* Set quick view images */
      let image = document.createElement("img");
      imageLink = "shirt_images/not-found.png";
      if (shirt.default.front !== undefined) {
        imageLink = shirt.default.front;
      } else if (shirt.colors !== undefined) {
        for (const color of Object.keys(shirt.colors)) {
          if (shirt.colors[color].front !== undefined) {
            imageLink = shirt.colors[color].front;
            break;
          }
        }
      }
      image.setAttribute("src", imageLink);
      section.getElementsByTagName("img")[0].src = image.src;

      image = document.createElement("img");
      imageLink = "shirt_images/not-found.png";
      if (shirt.default.back !== undefined) {
        imageLink = shirt.default.back;
      } else if (shirt.colors !== undefined) {
        for (const color of Object.keys(shirt.colors)) {
          if (shirt.colors[color].back !== undefined) {
            imageLink = shirt.colors[color].back;
            break;
          }
        }
      }
      image.setAttribute("src", imageLink);
      section.getElementsByTagName("img")[1].src = image.src;

      /* Set quick view link */
      section.getElementsByClassName("quickViewImgs")[0].href = `details.html?name=${shirt.name}`;

      /* Set quick view information */
      /* Set quick view name */
      document.getElementById("quickViewName").innerHTML = shirt.name;

      /* Set quick view price */
      document.getElementById("quickViewPrice").innerHTML = shirt.price;

      /* Set quick view description */
      document.getElementById("quickViewDescription").innerHTML = shirt.description;
    });
    div.appendChild(anchor);

    anchor = document.createElement("a");
    anchor.setAttribute("href", `details.html?name=${shirt.name}`);
    anchor.setAttribute("target", "_self");
    anchor.appendChild(document.createTextNode("See Page"));
    div.appendChild(anchor);

    shirtGrid.appendChild(div);

    /* Add shirt element */
    shirtsList.appendChild(shirtGrid);

    /* Set quick view close button */
    document.getElementsByClassName("quickViewInformation")[0].getElementsByTagName("a")[0].addEventListener("click", function () {
      document.getElementsByClassName("quickView")[0].style.display = "none";
    });
  }
};

let initDetails = () => {
  // To see the shirts object, run:
  // console.log(shirts);

  // Your Code Here
  let params = new URLSearchParams(window.location.search);
  let shirtName = params.get("name");
  let shirt;
  let shirtColor;
  let shirtSide = "front";

  for (let i = 0; i < shirts.length; ++i) {
    if (shirts[i].name === shirtName) {
      shirt = shirts[i];
      break;
    }
    if (i === shirts.length - 1) {
      window.location.location = "not_implemented.html";
      return;
    }
  }

  if (shirt.default === undefined && shirt.colors === undefined) {
    shirtColor = "shirt_images/not-found.png";
  } else if (shirt.default === undefined) {
    shirtColor = Object.keys(shirt.colors)[0];
  } else {
    shirtColor = "default";
  }

  /* Add shirt detail element */
  let shirtSection = document.getElementsByClassName("shirtDetailSection")[0];

  /* Add shirt name */
  let shirtTitle = document.createElement("h2");
  shirtTitle.setAttribute("class", "shirtTitle");
  shirtTitle.appendChild(document.createTextNode(shirt.name));
  shirtSection.appendChild(shirtTitle);

  /* Add shirt detail */
  let shirtInformation = document.createElement("div");
  shirtInformation.setAttribute("class", "shirtInformation");

  /* Add image of the shirt */
  let shirtImg = document.createElement("img");
  shirtImg.setAttribute("src", "shirt_images/not-found.png");
  shirtImg.setAttribute("alt", "A T-shirt");
  shirtImg.setAttribute("id", "shirtImg");
  shirtInformation.appendChild(shirtImg);

  /* Add shirt detail */
  let shirtDetail = document.createElement("div");

  /* Add price */
  let p = document.createElement("p");
  p.setAttribute("id", "shirtPrice");
  p.appendChild(document.createTextNode(`${shirt.price}`));
  shirtDetail.appendChild(p);

  /* Add description */
  p = document.createElement("p");
  p.setAttribute("id", "shirtDescription");
  p.appendChild(document.createTextNode(shirt.description));
  shirtDetail.appendChild(p);

  /* Add side buttons */
  p = document.createElement("p");
  let span = document.createElement("span");
  span.setAttribute("id", "shirtSide");
  span.appendChild(document.createTextNode("Side:"));
  p.appendChild(span);

  for (let side of ["Front", "Back"]) {
    let anchor = document.createElement("a");
    anchor.setAttribute("class", "shirtSideButton");
    anchor.appendChild(document.createTextNode(side));
    anchor.addEventListener("click", function () {
      shirtSide = side.toLowerCase();
      changeShirtImg(shirt, shirtColor, shirtSide);
    });
    p.appendChild(anchor);
  }
  shirtDetail.appendChild(p);

  /* Add shirt colors */
  p = document.createElement("p");
  span = document.createElement("span");
  span.setAttribute("id", "shirtColor");
  span.appendChild(document.createTextNode("Color:"));
  p.appendChild(span);

  Object.keys(shirt.colors).forEach(color => {
    let anchor = document.createElement("a");
    anchor.setAttribute("class", "shirtColorButton");
    anchor.appendChild(document.createTextNode(color));

    let textColor = (color === "black") ? "white" : "black";
    anchor.style.color = textColor;
    anchor.style.backgroundColor = color;
    anchor.addEventListener("mouseout", function () {
      this.style.color = textColor;
      this.style.backgroundColor = color;
    });
    anchor.addEventListener("mouseover", function () {
      this.style.color = "#c51230";
      this.style.backgroundColor = "white";
    });

    anchor.addEventListener("click", function () {
      shirtColor = color;
      changeShirtImg(shirt, shirtColor, shirtSide);
    });
    p.appendChild(anchor);
  });
  shirtDetail.appendChild(p);

  shirtInformation.appendChild(shirtDetail);
  shirtSection.appendChild(shirtInformation);
  changeShirtImg(shirt, shirtColor, shirtSide);
};

let changeShirtImg = function (shirt, shirtColor, shirtSide) {
  let image = document.getElementById("shirtImg");
  if (shirtColor === "default") {
    if (shirt[shirtColor] === undefined || shirt[shirtColor][shirtSide] === undefined) {
      image.src = "shirt_images/not-found.png"
    } else {
      image.src = shirt[shirtColor][shirtSide];
    }
  } else {
    if (shirt.colors === undefined || shirt.colors[shirtColor] === undefined || shirt.colors[shirtColor][shirtSide] === undefined) {
      image.src = "shirt_images/not-found.png";
    } else {
      image.src = shirt.colors[shirtColor][shirtSide];
    }
  }
};