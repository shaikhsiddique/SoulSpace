import { useState } from "react";
import axios from "../config/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Journel() {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("Auth-Token");

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Please write something before saving your journal.");
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(
        "/user/journals",
        { content },
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      toast.success("Your journal has been saved.");
      setContent("");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to save your journal. Try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC]  flex flex-col">
      <ToastContainer />
    <Navbar/>
      {/* Top bar */}
      

      {/* Content */}
      <main className="flex-1 px-5 py-4 bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC]  rounded-t-3xl mt-44 mx-44 ">
      <p onClick={()=> {navigate(-1)}} className=" cursor-pointer"> ⬅️ Go Back</p>
        <h2 className="text-2xl font-bold mb-3">Your Journal</h2>

        <p className="italic text-[15px] mb-4 text-gray-800">
          &quot;The purpose of journaling is not to write a perfect story but to
          capture your thoughts.&quot;
        </p>

        <p className="text-sm leading-relaxed text-gray-700 mb-6">
          Journaling is a great way to express your emotions, reflect on your
          day, and keep track of your mental state. It helps improve
          self-awareness and can be a therapeutic activity.
        </p>

        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-[15px]">
            Start writing your journal here:
          </p>
          <button
            onClick={() => navigate("/journels/history")}
            className="text-sm text-black underline underline-offset-2"
          >
            View past journals
          </button>
        </div>

        <textarea
          className="w-full h-60 border border-gray-300 rounded-md p-3 text-sm outline-none resize-none bg-white shadow-sm"
          placeholder="Write your thoughts here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 rounded-full bg-[#000000] text-white text-sm font-semibold shadow-md disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </main>

      
    </div>
  );
}

export default Journel;