const express = require("express");
const { createCanvas, loadImage, registerFont } = require("canvas");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function getDesign(holiday, gender) {
  const designs = {
    "New Year": {
      male: {
        bgGradient: ["#0a2f6c", "#1a3f7c"],
        textColor: "#ffdd99",
        decoration: "snow",
      },
      female: {
        bgGradient: ["#1a3f7c", "#2a4f8c"],
        textColor: "#ffdd99",
        decoration: "snow",
      },
    },
    "Feb 23": {
      male: {
        bgGradient: ["#4a6a2a", "#2a4a1a"],
        textColor: "#ffcc00",
        decoration: "stars",
      },
      female: {
        bgGradient: ["#5a7a3a", "#3a5a2a"],
        textColor: "#ffcc00",
        decoration: "stars",
      },
    },
    "Mar 8": {
      male: {
        bgGradient: ["#d46b9a", "#b04a7a"],
        textColor: "#ffffff",
        decoration: "flowers",
      },
      female: {
        bgGradient: ["#e68ab2", "#c96a9a"],
        textColor: "#fff0f0",
        decoration: "flowers",
      },
    },
    Birthday: {
      male: {
        bgGradient: ["#4a90e2", "#2c6cb0"],
        textColor: "#ffdd88",
        decoration: "balloons",
      },
      female: {
        bgGradient: ["#e25c8c", "#c03c6c"],
        textColor: "#ffffaa",
        decoration: "balloons",
      },
    },
    "Programmer's Day": {
      male: {
        bgGradient: ["#1e1e1e", "#2d2d2d"],
        textColor: "#00ff9d",
        decoration: "code",
      },
      female: {
        bgGradient: ["#2a2a2a", "#3a3a3a"],
        textColor: "#88ffaa",
        decoration: "code",
      },
    },
    "Cucumber day": {
      male: {
        bgGradient: ["#1e1e1e", "#2d2d2d"],
        textColor: "#00ff9d",
        decoration: "code",
      },
      female: {
        bgGradient: ["#e25c8c", "#c03c6c"],
        textColor: "#ffffaa",
        decoration: "balloons",
      },
    },
  };

  const holidayKey = holiday;
  const genderKey = gender.toLowerCase() === "male" ? "male" : "female";
  return (
    designs[holidayKey]?.[genderKey] || {
      bgGradient: ["#cccccc", "#aaaaaa"],
      textColor: "#000000",
      decoration: "default",
    }
  );
}

//? Draw decorations on canvas
async function drawDecorations(ctx, width, height, decorationType) {
  ctx.save();
  ctx.globalAlpha = 0.5;

  switch (decorationType) {
    case "snow":
      for (let i = 0; i < 150; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`;
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 3 + 1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      break;
    case "stars":
      for (let i = 0; i < 80; i++) {
        ctx.fillStyle = `rgba(255,215,0,${Math.random() * 0.7 + 0.3})`;
        ctx.beginPath();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = Math.random() * 4 + 2;
        for (let j = 0; j < 5; j++) {
          const angle = ((j * 72 - 90) * Math.PI) / 180;
          const x1 = x + r * Math.cos(angle);
          const y1 = y + r * Math.sin(angle);
          if (j === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          const x2 = x + (r / 2) * Math.cos(angle + (36 * Math.PI) / 180);
          const y2 = y + (r / 2) * Math.sin(angle + (36 * Math.PI) / 180);
          ctx.lineTo(x2, y2);
        }
        ctx.fill();
      }
      break;
    case "flowers":
      for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,192,203,${Math.random() * 0.6 + 0.2})`;
        ctx.beginPath();
        ctx.ellipse(
          Math.random() * width,
          Math.random() * height,
          8,
          12,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.fillStyle = `rgba(255,255,0,0.5)`;
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      break;
    case "balloons":
      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`;
        ctx.beginPath();
        ctx.ellipse(
          Math.random() * width,
          Math.random() * height,
          12,
          18,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      break;
    case "code":
      ctx.font = "20px monospace";
      ctx.fillStyle = "#00ff9d30";
      for (let i = 0; i < 60; i++) {
        ctx.fillText("</>", Math.random() * width, Math.random() * height);
      }
      break;
    case "cucumbers":
      for (let i = 0; i < 25; i++) {
        ctx.save();
        const x = Math.random() * width;
        const y = Math.random() * height;
        const angle = Math.random() * Math.PI * 2;
        const scaleX = 0.8 + Math.random() * 1.2;
        const scaleY = 0.3 + Math.random() * 0.6;

        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scaleX, scaleY);

        //? Тело огурца
        ctx.fillStyle = `rgba(80, 120, 40, ${0.3 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        //? Пупырышки
        ctx.fillStyle = `rgba(60, 90, 30, 0.6)`;
        for (let j = 0; j < 6; j++) {
          const dx = (Math.random() - 0.5) * 20;
          const dy = (Math.random() - 0.5) * 10;
          ctx.beginPath();
          ctx.arc(dx, dy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      break;
    default:
      //? simple dots
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(0,0,0,0.1)`;
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,
          Math.random() * height,
          2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
  }
  ctx.restore();
}

//? Main image generation function
async function generateGreetingCard(name, gender, holiday) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const design = getDesign(holiday, gender);
  const [startColor, endColor] = design.bgGradient;

  //? Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  //? Draw decorations
  await drawDecorations(ctx, width, height, design.decoration);

  //? Set text styles
  ctx.shadowBlur = 0; //? reset
  ctx.fillStyle = design.textColor;
  ctx.font = 'bold 48px "Segoe UI", "Arial", sans-serif';
  ctx.textAlign = "center";

  //? Holiday greeting
  let holidayText = "";
  switch (holiday) {
    case "New Year":
      holidayText = "С Новым годом!";
      break;
    case "Feb 23":
      holidayText = "С 23 февраля!";
      break;
    case "Mar 8":
      holidayText = "С 8 марта!";
      break;
    case "Birthday":
      holidayText = "С днём рождения!";
      break;
    case "Programmer's Day":
      holidayText = "С днём программиста!";
      break;
    case "Cucumber day":
      holidayText = "С днём огурца!";
      break;
    default:
      holidayText = `Счастливого ${holiday}!`;
  }

  ctx.fillStyle = design.textColor;
  ctx.font = 'bold 44px "Segoe UI", "Arial", sans-serif';
  ctx.fillText(holidayText, width / 2, 100);

  //? Personalized message
  ctx.font = 'italic 36px "Segoe UI", "Arial", sans-serif';
  ctx.fillStyle = "#fff0e0";
  ctx.fillText(`Дорогой(ая) ${name}!`, width / 2, 280);

  //? Additional message
  ctx.font = '28px "Segoe UI", "Arial", sans-serif';
  ctx.fillStyle = design.textColor;
  ctx.fillText("Желаем счастья и здоровья!", width / 2, 460);

  //? Footer
  ctx.font = '20px "Segoe UI", "Arial", sans-serif';
  ctx.fillStyle = "#ffffffaa";
  ctx.fillText("С любовью, ваш сервис открыток", width / 2, 560);

  return canvas.toBuffer("image/png");
}

//? Route to serve the form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//? Route to generate and download the card
app.get("/generate", async (req, res) => {
  try {
    const { name, gender, holiday } = req.query;
    if (!name || !gender || !holiday) {
      return res.status(400).send("Missing parameters");
    }

    const imageBuffer = await generateGreetingCard(name, gender, holiday);
    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": 'attachment; filename="greeting_card.png"',
      "Content-Length": imageBuffer.length,
    });
    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating card");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://?localhost:${PORT}`);
});
