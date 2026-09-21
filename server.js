import express from "express";
import {
  loadModel,
  completion,
  LLAMA_3_2_1B_INST_Q4_0
} from "@qvac/sdk";

const app = express();

app.use(express.json());
app.use(express.static("public"));

let modelId;

async function init() {
  console.log("Loading model...");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0
  });

  console.log("Model loaded:", modelId);
}

app.post("/api/plan", async (req, res) => {
  try {
    const { examDays, subjects } = req.body;

    const result = completion({
      modelId,
      history: [
        {
          role: "user",
          content: `Create a ${examDays}-day study plan for ${subjects}`
        }
      ],
      stream: false
    });

    const plan = await result.text;

    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

init().catch(console.error);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});