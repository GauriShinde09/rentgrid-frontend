
import { useState } from "react";
import {
  Bot,
  Search,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import api from "../../api/axiosConfig";

function AIDamageAssessment() {
  const [description, setDescription] = useState("");
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAssessment(e) {
    e.preventDefault();

    if (!description.trim()) {
      setError("Please enter a description of the vehicle damage.");
      return;
    }

    setLoading(true);
    setError("");
    setAssessment(null);

    try {
      const response = await api.post(
        "/rentgrid/ai/assess-damage",
        {
          description: description.trim(),
        }
      );

      setAssessment(response.data);
    } catch (err) {
      console.error("AI damage assessment failed:", err);

      setError(
        err.response?.data?.message ||
          "Could not assess the damage. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function getSeverityStyle(severity) {
    const value = String(severity || "").toLowerCase();

    if (value === "minor") {
      return "bg-green-100 text-green-700";
    }

    if (value === "moderate") {
      return "bg-amber-100 text-amber-700";
    }

    if (value === "severe" || value === "major") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-700";
  }

  return (
    <section className="space-y-6">
      {/* Page heading */}
      <div>
        <p className="text-xs font-bold tracking-[2px] text-blue-600">
          INTELLIGENT VEHICLE INSPECTION
        </p>

        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          AI Damage Assessment
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Analyze reported vehicle damage and get an AI-generated
          repair estimate and recommendation.
        </p>
      </div>

      {/* Description form */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <Bot size={25} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Describe the damage
              </h3>
              <p className="text-sm text-slate-500">
                Enter the observed damage details.
              </p>
            </div>
          </div>

          <form onSubmit={handleAssessment}>
            <label
              htmlFor="damage-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Damage description
            </label>

            <textarea
              id="damage-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: The front bumper has a visible dent and scratches after a minor collision."
              rows={6}
              className="w-full resize-y rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {error && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !description.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={18} />
              {loading ? "Assessing Damage..." : "Assess Damage"}
            </button>
          </form>

          <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
            <strong>Note:</strong> The AI result is an initial estimate.
            A physical inspection by a qualified professional is
            needed to confirm actual damage and repair costs.
          </div>
        </div>

        {/* Assessment results */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Assessment Results
              </h3>
              <p className="text-sm text-slate-500">
                AI-generated assessment details.
              </p>
            </div>
          </div>

          {!assessment && !loading && (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 text-center">
              <div className="rounded-full bg-slate-100 p-4 text-slate-400">
                <Wrench size={30} />
              </div>

              <h4 className="mt-4 font-semibold text-slate-700">
                No assessment yet
              </h4>

              <p className="mt-2 max-w-xs text-sm text-slate-500">
                Enter the damage description and click Assess Damage
                to view the result here.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="rounded-full bg-blue-50 p-4 text-blue-600">
                <Search size={30} />
              </div>

              <p className="mt-4 font-semibold text-slate-700">
                Analyzing damage...
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Please wait while the AI prepares the assessment.
              </p>
            </div>
          )}

          {assessment && !loading && (
            <div className="space-y-4">
              {/* Severity and category */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Damage Category
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    {assessment.damageCategory || "Not specified"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Severity
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${getSeverityStyle(
                      assessment.severity
                    )}`}
                  >
                    {assessment.severity || "Not specified"}
                  </span>
                </div>
              </div>

              {/* Estimated repair cost */}
              <div className="rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white">
                <div className="flex items-center gap-2 text-blue-100">
                  <IndianRupee size={20} />
                  <p className="text-sm font-medium">
                    Estimated Repair Cost
                  </p>
                </div>

                <p className="mt-2 text-3xl font-extrabold">
                  {assessment.estimatedRepairCost != null
                    ? `₹${Number(
                        assessment.estimatedRepairCost
                      ).toLocaleString("en-IN")}`
                    : "Not provided"}
                </p>

                <p className="mt-2 text-xs text-blue-100">
                  AI estimate only; actual charges may differ.
                </p>
              </div>

              {/* Description */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                  <AlertTriangle size={17} className="text-amber-600" />
                  Damage Description
                </h4>

                <p className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                  {assessment.description || "No description provided."}
                </p>
              </div>

              {/* Recommendation */}
              <div>
                <h4 className="mb-2 flex items-center gap-2 font-bold text-slate-800">
                  <Wrench size={17} className="text-blue-600" />
                  AI Recommendation
                </h4>

                <p className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                  {assessment.recommendation ||
                    "No recommendation provided."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAssessment(null);
                  setError("");
                  setDescription("");
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                New Assessment
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AIDamageAssessment;
