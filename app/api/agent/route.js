import { GoogleGenAI } from "@google/genai";
import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const platform = os.platform();
const asyncExecute = promisify(exec);
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY || "AIzaSyDMm5gvphiTn0aIv-dpnmq1oQ1fWrW-C4c" });

const executeCommand = async ({ command }) => {
  try {
    const { stdout, stderr } = await asyncExecute(command);
    if (stderr) {
      return `Error: ${stderr}`;
    }
    return `Success: ${stdout} || Task executed completely`;
  } catch (error) {
    return `Error: ${error}`;
  }
};

const executeCommandDeclaration = {
  name: "executeCommand",
  description: "Execute a single terminal/shell command. A command can be to create a folder, file, write on a file, edit the file or delete the file",
  parameters: {
    type: "OBJECT",
    properties: {
      command: {
        type: "STRING",
        description: 'It will be a single terminal command. Ex: "mkdir calculator"',
      },
    },
    required: ["command"],
  },
};

const availableTools = {
  executeCommand,
};

async function runAgent(userProblem) {
  const History = [
    {
      role: "user",
      parts: [{ text: userProblem }],
    },
  ];

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: History,
      config: {
        systemInstruction: `You are an Website builder expert. You have to create the frontend of the website by analysing the user Input.\nYou have access of tool, which can run or execute any shell or terminal command.\nCurrent user operation system is: ${platform}\nGive command to the user according to its operating system support.\n<-- What is your job -->\n1: Analyse the user query to see what type of website the want to build\n2: Give them command one by one , step by step\n3: Use available tool executeCommand\n// Now you can give them command in following below\n1: First create a folder, Ex: mkdir "calulator"\n2: Inside the folder, create index.html , Ex: touch "calculator/index.html"\n3: Then create style.css same as above\n4: Then create script.js\n5: Then write a code in html file\nYou have to provide the terminal or shell command to user, they will directly execute it`,
        tools: [
          {
            functionDeclarations: [executeCommandDeclaration],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const { name, args } = response.functionCalls[0];
      const funCall = availableTools[name];
      const result = await funCall(args);
      const functionResponsePart = {
        name: name,
        response: {
          result: result,
        },
      };
      History.push({
        role: "model",
        parts: [
          {
            functionCall: response.functionCalls[0],
          },
        ],
      });
      History.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      History.push({
        role: "model",
        parts: [{ text: response.text }],
      });
      return response.text;
    }
  }
}

export async function POST(req) {
  try {
    const { userProblem } = await req.json();
    if (!userProblem) {
      return Response.json({ error: "Missing userProblem" }, { status: 400 });
    }
    const result = await runAgent(userProblem);
    return Response.json({ result });
  } catch (err) {
    return Response.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
