import React from "react";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside style={{ width: "50px", background: "#f4f4f4" }}>
      <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "1rem" }}>
        {/* Button 0 */}
        <div className="pt-4 flex flex-col items-center justify-center">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border p-1 hover:bg-pink-300 transition-colors">
            <Image className="MenuType" src="/detailBtn.svg" alt="Menu Button" width={20} height={20} />
          </button>
          <span className="HomeSpan">Menu</span>
        </div>

        {/* Button 1 */}
        <div className="pt-4 flex flex-col items-center justify-center">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border p-1 hover:bg-pink-300 transition-colors">
            <Image className="homeImageType" src="/HomeBtn.svg" alt="Home Button" width={20} height={20} />
          </button>
          <span className="HomeSpan">Home</span>
        </div>

        {/* Button 2 */}
        <div className="pt-1 flex flex-col items-center justify-center">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border p-1 hover:bg-pink-300 transition-colors">
            <Image className="CreateType" src="/NewBtn.svg" alt="Create Button" width={30} height={30} />
          </button>
          <span className="HomeSpan">Tạo</span>
        </div>

        {/* Button 3 */}
        <div className="pt-1 flex flex-col items-center justify-center">
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border p-1 hover:bg-pink-300 transition-colors">
            <Image className="ProjectType" src="/ProjectBtn.svg" alt="Project Button" width={20} height={20} />
          </button>
          <span className="HomeSpan">Dự án</span>
        </div>

        {/* Spacer to push buttons to the bottom */}
        <div style={{ flexGrow: 1 }}></div>

        {/* Button 4 */}
        <div className="flex flex-col items-center justify-center">
          <button className="w-10 h-10 flex items-center justify-center rounded-4xl p-1 hover:bg-pink-300 transition-colors">
            <Image className="NotificationType" src="/Notification.svg" alt="Notification Button" width={20} height={20} />
          </button>
        </div>

        {/* Button 5 */}
        <div className="flex flex-col items-center justify-center" style={{ marginBottom: "5px" }}>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border p-1 hover:bg-pink-300 transition-colors">
            <Image className="AvatarType" src="/Avatar.svg" alt="Avatar" width={30} height={30} />
          </button>
        </div>
      </div>
    </aside>
  );
}