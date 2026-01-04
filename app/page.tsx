import { useRouter } from "next/navigation";
import { auth, loginWithGoogle } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Cpu, Shield, Brain, Loader2 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Optional: Auto redirect if already logged in?
        // router.push("/chat");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/chat");
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans selection:bg-green-500/30">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-green-500" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">NeuroForge</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://github.com/emanuelediluzio/NeuroForge" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">GitHub</a>
          {user && (
            <div className="hidden md:flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-700" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs text-white">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-gray-300">Local Orchestrator Active</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
            Your Sovereign AI <br /> Fine-Tuning Studio.
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Train, finetune, and orchestrate open-source LLMs on your own infrastructure.
            A Vercel-hosted control plane for your local GPU cluster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="h-12 px-8 text-base bg-green-600 hover:bg-green-700 text-white border-0 font-medium min-w-[180px]"
              onClick={user ? () => router.push("/chat") : handleLogin}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : user ? "Enter Studio" : "Start Training"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>

            <a href="https://github.com/emanuelediluzio/NeuroForge" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white hover:border-gray-600">
                View Documentation
              </Button>
            </a>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="px-6 py-24 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Terminal className="w-6 h-6 text-green-500" />}
            title="Natural Language Ops"
            description="Control your training pipeline with simple chat commands. No complex YAML configs needed."
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-blue-500" />}
            title="Data Sovereignty"
            description="Your datasets and weights never leave your machine. The interface runs on Vercel, the logic runs on your GPU."
          />
          <FeatureCard
            icon={<Cpu className="w-6 h-6 text-purple-500" />}
            title="Local Power"
            description="Leverage your own hardware (NVIDIA/Apple Silicon) for zero-cost fine-tuning and inference."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-600 border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} NeuroForge. Open Source.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-black hover:bg-white/5 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}
