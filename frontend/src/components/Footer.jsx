import { Link } from "react-router";

function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Brand */}
          <div className="max-w-md">
            <h2 className="text-xl font-bold">
              Study Vault
            </h2>

            <p className="text-gray-600 mt-3">
              A collaborative platform where students
              can share resources, save notes, ask
              doubts, and learn together.
            </p>
          </div>

          {/* Contact */}
          <div className="md:text-right">
            <h3 className="font-semibold mb-4">
              Contact
            </h3>

            <p className="text-gray-600">
              support@studyvault.com
            </p>

            <p className="text-gray-600 mt-2">
              Built for students, by students.
            </p>
          </div>

        </div>

        <div className="border-t border-[#e5e5e5] mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Study Vault.
          All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;