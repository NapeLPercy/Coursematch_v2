import ChatBot from "react-chatbotify";

export default function ChatWidget() {
  const flow = {
    start: {
      message: "Hi! I'm the CourseMatch assistant. How can I help?",
      path: "main",
    },
    main: {
      message: async ({ userInput }) => {
        const res = await fetch("http://localhost:5000/api/chat/sendMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userInput }),
        });

        const data = await res.json();
        return data[0].text || "Sorry, something went wrong.";
      },
      path: "main",
    },
  };

  return (
    <ChatBot
      options={{
        theme: {
          embedded: false, // floating bot mode
          primaryColor: "#0056ff",
        },
        header: {
          title: "CourseMatch Assistant",
        },
      }}
      flow={flow}
    />
  );
}
