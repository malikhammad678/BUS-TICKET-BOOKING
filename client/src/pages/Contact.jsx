import { Loader, Mail, Phone, Pin, Send } from "lucide-react";
import { useAppContext } from "../context/Context";
import { useState } from "react";

const Contact = () => {
  const { sendMessage, loading } = useAppContext();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(firstName, lastName, email, phone, message);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 bg-gray-50">

      <div className="flex md:flex-row flex-col items-start pt-28 sm:pt-32 md:pt-40 justify-between pb-16 sm:pb-20 gap-10 md:gap-8 lg:gap-12">

        <div className="w-full md:w-[45%]">
          <h1 className="text-3xl sm:text-4xl font-semibold text-primary">Contact Us</h1>
          <p className="text-gray-500 my-3 text-sm sm:text-base leading-relaxed">
            Have a question or just want to say hello? <br className="hidden sm:block" />
            We'd love to hear from you.
          </p>

          <a href="mailto:info@busco.com" className="mt-6 flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:text-primary transition-colors">
            <Mail className="size-5 text-primary shrink-0" />
            info@busco.com
          </a>
          <a href="tel:+923251453078" className="mt-4 flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:text-primary transition-colors">
            <Phone className="size-5 text-primary shrink-0" />
            +923251453078
          </a>
          <div className="mt-4 flex items-center gap-2 text-sm sm:text-base text-gray-700">
            <Pin className="size-5 text-primary shrink-0" />
            Faisalabad, Punjab, Pakistan
          </div>
        </div>

        <div className="w-full md:w-[55%] p-5 sm:p-8 shadow-2xl rounded-lg bg-white">
          <h2 className="text-2xl sm:text-3xl font-medium">Get In Touch</h2>
          <p className="text-sm text-gray-500 mt-1 mb-3">You can reach us anytime</p>

          <form onSubmit={handleSubmit} className="mt-6 sm:mt-10">

            <div className="flex items-center justify-between gap-3">
              <input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-300 px-3 py-2.5 sm:py-3 text-sm rounded-lg outline-none focus:border-primary transition-colors"
                required
              />
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                type="text"
                placeholder="Last Name"
                className="w-full border border-gray-300 px-3 py-2.5 sm:py-3 text-sm rounded-lg outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="w-full mt-4 border border-gray-300 px-3 py-2.5 sm:py-3 text-sm rounded-lg outline-none focus:border-primary transition-colors"
              required
            />
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="tel"
              placeholder="Phone"
              className="w-full mt-4 border border-gray-300 px-3 py-2.5 sm:py-3 text-sm rounded-lg outline-none focus:border-primary transition-colors"
              required
            />
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="How can we help?"
              className="w-full h-36 sm:h-44 mt-4 border border-gray-300 px-3 py-3 text-sm rounded-lg outline-none focus:border-primary transition-colors resize-none"
            ></textarea>

            <button
              type="submit"
              className="mt-3 flex items-center gap-2 justify-center w-full py-2.5 sm:py-3 rounded-lg cursor-pointer bg-primary text-white text-sm sm:text-base hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <Loader className="animate-spin size-5" />
              ) : (
                <>
                  Send <Send className="size-4" />
                </>
              )}
            </button>

          </form>
        </div>
      </div>

      <div className="flex md:flex-row flex-col items-center justify-between pb-16 sm:pb-20 gap-8 md:gap-10">

        <div className="w-full md:w-[50%]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217897.62046143698!2d72.92448580884746!3d31.42375904202356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392242a895a55ca9%3A0xdec58f88932671c6!2sFaisalabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1772634260245!5m2!1sen!2s"
            width="100%"
            height="350"
            className="rounded-lg w-full sm:h-[420px] md:h-[500px]"
            style={{ height: undefined }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

        <div className="w-full md:w-[45%]">
          <h3 className="font-medium text-xl sm:text-2xl text-primary">Our Location</h3>
          <h1 className="text-black font-semibold text-2xl sm:text-3xl mt-1 leading-snug">
            Connecting Near and Far
          </h1>
          <h4 className="text-base sm:text-lg text-black mt-5 font-medium">Headquarters</h4>
          <p className="mt-1 text-gray-600 text-sm sm:text-base">Faisalabad, Pakistan</p>
        </div>

      </div>
    </div>
  );
};

export default Contact;