import { useState, useEffect, useRef } from "react";
import {
  Mail,
  ArrowRight,
  Bot,
  Shield,
  Sparkles,
  BarChart,
  Clock,
  User,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring" } },
};


// HowItWorks component definition
const HowItWorks = () => {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Email Reception",
      description:
        "New emails arrive in your inbox and are intercepted by our system.",
    },
    {
      title: "Classification & Analysis",
      description:
        "AI analyzes content, context, and metadata to determine importance and category.",
    },
    {
      title: "Action Extraction",
      description:
        "AI identifies required actions, deadlines, and responsibilities from the email.",
    },
    {
      title: "Smart Interface Presentation",
      description:
        "System presents analyzed emails with summaries, actions, and response suggestions.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const stepElements = section.querySelectorAll(".timeline-step");
      stepElements.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="how-it-works" className="py-16 !bg-[#667eea]" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">How It Works</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto italic">
            Our collaborative AI agents work together to transform your inbox
            into an organized, actionable system.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-100">
            {/* Animated progress */}
            <div
              className="bg-indigo-800 ck w-1 transition-all duration-500 ease-in-out"
              style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative mb-12 timeline-step">
              <div className="flex items-center mb-2">
                {/* Left column (text or empty depending on even/odd) */}
                {index % 2 === 0 ? (
                  <>
                    <div className="w-1/2 pr-8 text-right">
                      <h3 className="text-xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center z-10 shadow-md">
                      {index + 1}
                    </div>
                    <div className="w-1/2 pl-8">
                      <p
                        className={`text-white italic transition-opacity duration-500 ${
                          activeStep >= index ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-1/2 pr-8 text-right">
                      <p
                        className={`text-white italic transition-opacity duration-500 ${
                          activeStep >= index ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center z-10 shadow-md">
                      {index + 1}
                    </div>
                    <div className="w-1/2 pl-8">
                      <h3 className="text-xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Index component
const Index = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/api/emails", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          navigate("/dashboard");
        }
      })
      .catch(() => {
        // Not logged in or error, do nothing
      });
  }, []);
  const heroRef = useRef(null);

useEffect(() => {
  let effect: any;

  const loadVanta = async () => {
    const THREE = await import("three");
    const VANTA = await import("vanta/dist/vanta.net.min");

    if (heroRef.current) {
      effect = VANTA.default({
        el: heroRef.current,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0x90074,
        backgroundColor: 0x667eea,
        points: 11.0,
        maxDistance: 17.0,
        spacing: 12.0
      });
    }
  };

  loadVanta();

  return () => {
    if (effect) effect.destroy();
  };
}, []);


  const plans = [
    {
      name: "Free",
      description: "Basic email management for personal use",
      price: {
        monthly: 0,
        annual: 0,
      },
      features: [
        "Connect 1 email account",
        "Basic email categorization",
        "100 AI-processed emails per month",
        "Email summaries",
        "Basic spam protection",
      ],
    },
    {
      name: "Pro",
      description: "Advanced features for professionals",
      price: {
        monthly: 9.99,
        annual: 7.99,
      },
      popular: true,
      features: [
        "Connect 3 email accounts",
        "Advanced email categorization",
        "Unlimited AI-processed emails",
        "Priority inbox",
        "Advanced spam protection",
        "Email analytics",
        "Quick actions & templates",
      ],
    },
    {
      name: "Business",
      description: "Complete solution for teams and businesses",
      price: {
        monthly: 19.99,
        annual: 16.99,
      },
      features: [
        "Connect unlimited email accounts",
        "Team collaboration features",
        "Admin dashboard",
        "Custom integrations",
        "Advanced analytics",
        "Priority support",
        "Custom AI training",
        "99.9% uptime SLA",
      ],
    },
  ];

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading and redirect
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading and redirect
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleDemoAccess = () => {
    setLoading(true);

    // Simulate loading and redirect
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}

      <header className="py-4 px-6 bg-red border-b ">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Mail className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-bold">AInbox</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Pricing
            </a>
          </nav>
          <div>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = "http://localhost:5000/auth/login")
              }
              className="w-full flex justify-center items-center gap-2 mt-1"
            >
              <Mail className="w-4 h-4" />
              Sign in with Gmail
            </Button>
          </div>
        </div>
      </header>



      {/* Hero Section */}
      <section
  ref={heroRef}
  id="hero"
  className="!bg-[#667eea] py-16 md:py-20 flex items-center justify-center min-h-screen relative overflow-hidden"
>

  <div className="container mx-auto px-6 flex flex-col items-center text-center text-white relative z-10">
    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-black">
      Smart Email Triage with Agentic AI Assistants
    </h1>

    <p className="text-lg text-white font-bold mb-6 !bg-[#667eea] md:mb-8 max-w-2xl">
      Our AI agents collaborate to classify, extract action items, and generate responses from your emails, saving you hours each day.
    </p>
    <button className="bg-white !text-[#5f77e1] text-lg font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300">
      Try It Now
    </button>
    <blockquote className="mt-10 italic bg-white max-w-md !text-[#4f71e3]">
      "This saved me hours each week — it's like having a personal assistant for email."
    </blockquote>
    <div
      className="mt-12 cursor-pointer transition-transform duration-300 hover:scale-110"
      onClick={() => {
        const el = document.getElementById("features");
        el?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <svg
        className="w-6 h-6 text-gray-200 animate-bounce"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</section>

      {/* Features Section */}
     <section id="features" className="!bg-[#ffffff] mb-20 ">
      
  <div className="container mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold mb-20 mt-20 font-mono text-black underline-offset-2">
        Intelligent Email Management
      </h2>
      <p className="text-md text-gray-600 max-w-2xl mx-auto text-black italic">
        Our AI-powered platform transforms how you handle emails with
        smart automation and collaborative AI agents.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
    scale: 1.04,
    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeInOut" },
  }}

        className="transition-all duration-300"
      >
        <Card className="border-t-4 border-t-blue-500 my-4 shadow hover:shadow-lg">
          <CardHeader>
            <Sparkles className="h-10 w-10 text-blue-500 mb-2" />
            <CardTitle>Smart Classification</CardTitle>
            <CardDescription>
              AI agents automatically sort and prioritize incoming emails
              based on content and urgency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Urgent vs. non-urgent categorization
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Topic-based labeling
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Sender reputation analysis
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
    scale: 1.04,
    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeInOut" },
  }}

        className="transition-all duration-300"
      >
        <Card className="border-t-4 border-t-amber-500 my-4 shadow hover:shadow-lg">
          <CardHeader>
            <Clock className="h-10 w-10 text-amber-500 mb-2" />
            <CardTitle>Action Extraction</CardTitle>
            <CardDescription>
              Extract and prioritize action items from emails to ensure
              nothing falls through the cracks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Automated task extraction
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Deadline identification
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Priority-based sorting
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{
    scale: 1.04,
    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeInOut" },
  }}

        className="transition-all duration-300"
      >
        <Card className="border-t-4 border-t-purple-500 my-4 shadow hover:shadow-lg">
          <CardHeader>
            <Bot className="h-10 w-10 text-purple-500 mb-2" />
            <CardTitle>AI Response Generation</CardTitle>
            <CardDescription>
              Create appropriate response drafts based on email content and
              your communication style.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Smart reply suggestions
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                Tone and style matching
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full !bg-[#] mr-2"></div>
                One-click responses
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
</section>


      {/* How It Works Section */}
      <HowItWorks />

      {/*Pricing*/}
      <section id="pricing" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="flex justify-center items-center mb-10">
            <span
              className={`mr-3 ${
                !isAnnual ? "font-medium text-primary" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAnnual}
                onChange={() => setIsAnnual(!isAnnual)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span
              className={`ml-3 ${
                isAnnual ? "font-medium text-primary" : "text-gray-500"
              }`}
            >
              Annual{" "}
              <span className="text-xs ml-1 bg-amber-100 text-amber-800 py-0.5 px-1.5 rounded-full">
                Save 20%
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden ${
                  plan.popular
                    ? "border-primary shadow-lg relative"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-xs py-1 px-3 rounded-bl">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      ${isAnnual ? plan.price.annual : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-gray-500">/month</span>
                    )}
                    {isAnnual && plan.price.monthly > 0 && (
                      <p className="text-sm text-gray-500">Billed annually</p>
                    )}
                  </div>
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? ""
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check
                          size={16}
                          className="text-green-500 mt-1 mr-2 flex-shrink-0"
                        />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/*Reviews*/}
      <section className="py-16 bg-gray-50">
  <div className="container mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Thousands of professionals trust AInbox to manage their email workflow
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Review 1 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
        <div className="p-6 flex flex-col h-full border-t-4 !border-[#667eea]">
          {/* Header with photo and name */}
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full !bg-[#ced7ff] flex items-center justify-center mr-3 overflow-hidden">
              <User className="h-6 w-6 !text-[#667eea]" />
            </div>
            <div>
              <h4 className="font-bold">Sarah Johnson</h4>
              <p className="text-sm text-gray-500">Marketing Director</p>
            </div>
          </div>
          
          {/* Rating - with hover animation for each star */}
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className="w-5 h-5 !text-[#667eea] transition-all duration-300 hover:scale-125 hover:rotate-12" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          {/* Review content */}
          <p className="text-gray-600 italic mb-4 flex-grow">
            "AInbox has completely transformed how I handle emails. The AI's ability to identify action items saves me hours each week. I'm now responding to critical emails faster than ever before."
          </p>
          
          {/* Animated highlight */}
          <div className="mt-2 !bg-[#ebefff] !text-[#667eea] font-medium p-2 rounded-md transform transition-transform">
            Increased productivity by 45%
          </div>
        </div>
      </div>
      
      {/* Review 2 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
        <div className="p-6 flex flex-col h-full border-t-4 !border-[#667eea]">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full !bg-[#ced7ff] flex items-center justify-center mr-3 overflow-hidden">
              <User className="h-6 w-6 !text-[#667eea]" />
            </div>
            <div>
              <h4 className="font-bold">Michael Chen</h4>
              <p className="text-sm text-gray-500">Software Engineer</p>
            </div>
          </div>
          
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className="w-5 h-5 !text-[#667eea] transition-all duration-300 hover:scale-125 hover:rotate-12" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <p className="text-gray-600 italic mb-4 flex-grow">
            "The smart classification system is incredible. It understands which emails need my immediate attention and which can wait. The action extraction feature is pure magic for my project management workflow."
          </p>
          
          <div className="mt-2 !bg-[#ebefff] !text-[#667eea] font-medium p-2 rounded-md transform transition-transform">
            Reduced email stress by 70%
          </div>
        </div>
      </div>
      
      {/* Review 3 */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
        <div className="p-6 flex flex-col h-full border-t-4 !border-[#667eea]">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full !bg-[#ced7ff] flex items-center justify-center mr-3 overflow-hidden ">
              <User className="h-6 w-6 !text-[#667eea]" />
            </div>
            <div>
              <h4 className="font-bold">Emma Rodriguez</h4>
              <p className="text-sm text-gray-500">Startup Founder</p>
            </div>
          </div>
          
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className="w-5 h-5 !text-[#667eea] transition-all duration-300 hover:scale-125 hover:rotate-12" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          <p className="text-gray-600 italic mb-4 flex-grow">
            "As a founder, my inbox was overwhelming me before AInbox. Now the AI response generation helps me reply professionally without spending hours crafting emails. This tool has been a game-changer for my business."
          </p>
          
          <div className="mt-2 !bg-[#ebefff] !text-[#667eea] font-medium p-2 rounded-md transform transition-transform">
            Saved 12+ hours weekly
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Footer */}
      <footer className="!bg-[#2c3d88] text-white py-6">
  <div className="px-6 max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1 text-left">
        <div className="flex items-center mb-2">
          <Mail className="h-5 w-5 mr-2" />
          <h3 className="text-base font-bold">AInbox</h3>
        </div>
        <p className="text-gray-200 text-sm leading-snug">
          Smart email triage and action automation with AI assistants.
        </p>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="mt-4 flex justify-center">
      <p className="text-xs text-gray-200 text-center">
        &copy; 2025 AInbox. All rights reserved.
      </p>
    </div>
  </div>
</footer>




    </div>
  );
};

export default Index;
