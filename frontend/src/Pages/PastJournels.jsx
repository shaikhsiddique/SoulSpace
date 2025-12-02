import { useEffect, useState } from "react";
import axios from "../config/axios";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function PastJournels() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("Auth-Token");

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await axios.get("/user/journals", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJournals(res.data.journals || []);
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data?.error || "Failed to load your journals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, [token]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC] flex flex-col">
      <ToastContainer />
      <Navbar />

      <main className="flex-1 px-5 py-4 bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC] rounded-t-3xl mt-44 mx-44">
        <p
          onClick={() => {
            navigate(-1);
          }}
          className="cursor-pointer"
        >
          ⬅️ Go Back
        </p>

        <h2 className="text-2xl font-bold mb-4 mt-2">Your Past Journals</h2>

        {loading ? (
          <p className="text-sm text-gray-700">Loading your journals...</p>
        ) : journals.length === 0 ? (
          <p className="text-sm text-gray-700">
            You have not written any journals yet. Start by writing one today.
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {journals.map((journal) => (
              <div
                key={journal._id}
                className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
              >
                <p className="text-xs text-gray-500 mb-2">
                  {formatDate(journal.date)}
                </p>
                <p className="text-sm whitespace-pre-wrap text-gray-800">
                  {journal.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PastJournels;


