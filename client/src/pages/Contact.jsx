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
    <div className="px-2 sm:px-4 md:px-6 lg:px-20 bg-gray-50">
      <div className="flex md:flex-row flex-col items-start pt-40 justify-between min-h-screen pb-20">
        <div className="max-w-[50%] w-full ">
          <h1 className="text-4xl  font-[600] text-primary">Contact Us</h1>
          <p className="text-gray-500 my-3">
            Have a question or just want to say hello? <br /> We'd love to hear
            from you.
          </p>
          <a
            href="mailto:info@busco.com"
            className="mt-6 flex items-center gap-2"
          >
            <Mail className="size-5 text-primary" />
            info@busco.com
          </a>
          <a href="tel:+923251453078" className="mt-5 flex items-center gap-2 ">
            <Phone className="size-5 text-primary" />
            +923251453078
          </a>
          <a href="tel:+923251453078" className="mt-5 flex items-center gap-2">
            <Pin className="size-5 text-primary" />
            Faisalabad, Punjab, Pakistan
          </a>
        </div>
        <div className="max-w-[50%] w-full p-8 shadow-2xl rounded-lg bg-white">
          <h2 className="text-3xl font-[500]">Get In Touch</h2>
          <p className="text-sm text-gray-500 mt-1 mb-3">
            You can reach us anytime
          </p>
          <form onSubmit={handleSubmit} className="mt-10">
            <div className="flex items-center justify-between gap-3">
              <input
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                type="text"
                placeholder="First Name"
                className="w-full border border-gray-300 px-3 py-3 text-sm rounded-lg outline-0"
                required
              />
              <input
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                type="text"
                placeholder="Last Name"
                className="w-full border border-gray-300 px-3 py-3 text-sm rounded-lg outline-0"
                required
              />
            </div>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              className="w-full mt-4 border border-gray-300 px-3 py-3 text-sm rounded-lg outline-0"
              required
            />
            <input
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              type="phone"
              placeholder="Phone"
              className="w-full mt-4 border border-gray-300 px-3 py-3 text-sm rounded-lg outline-0"
              required
            />
            <textarea
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              name=""
              placeholder="How can we help?"
              className="w-full h-50 mt-4 border border-gray-300 px-3 py-3 text-sm rounded-lg outline-0"
              id=""
            ></textarea>

            <button
              type="submit"
              className="mt-3 flex items-center gap-2 justify-center w-full py-3 rounded-lg cursor-pointer bg-primary text-white"
            >
              {loading ? (
                <Loader className="animate-spin size-5" />
              ) : (
                <>
                  Send <Send />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-center pt-20 justify-between min-h-screen pb-20 gap-10 ">
        <div className="max-w-[50%] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217897.62046143698!2d72.92448580884746!3d31.42375904202356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x392242a895a55ca9%3A0xdec58f88932671c6!2sFaisalabad%2C%20Pakistan!5e0!3m2!1sen!2s!4v1772634260245!5m2!1sen!2s"
            width="100%"
            height="500"
            className="rounded-lg"
          ></iframe>
        </div>
        <div className="max-w-[50%] w-full">
          <h3 className="text-black font-[500] text-2xl text-primary">
            Our Location
          </h3>
          <h1 className="text-black font-[600] text-3xl mt-1">
            Connecting Near and Far
          </h1>
          <h4 className="text-lg text-black mt-5">Headquaters</h4>
          <p className="mt-1">Faisalabad, Pakistan</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
