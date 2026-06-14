function Footer() {
  return (
    <footer className="border-t border-[#e6e6e6] bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-[14px] font-bold text-[#262626]">Study Vault</p>

        <p className="text-[13px] font-light text-[#9a9a9a]">
          © {new Date().getFullYear()} Study Vault. All rights reserved.
        </p>

        

      </div>
    </footer>
  );
}

export default Footer;