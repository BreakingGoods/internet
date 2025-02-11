document.addEventListener("DOMContentLoaded", function () {
    const reportForm = document.getElementById("reportForm");
    const equipmentSelect = document.getElementById("equipment");
    const roomSelect = document.getElementById("room");
    const detailsSelect = document.getElementById("details");
    const imageInput = document.getElementById("image");
    const previewImage = document.getElementById("preview");

    if (!reportForm || !equipmentSelect || !roomSelect || !detailsSelect || !imageInput || !previewImage) {
        console.error("ไม่พบองค์ประกอบบางตัวในหน้า");
        return;
    }

    // 📌 เมื่อมีการส่งฟอร์ม
    reportForm.addEventListener("submit", function (event) {
        event.preventDefault(); // ป้องกันการโหลดหน้าใหม่

        const equipment = equipmentSelect.value;
        const room = roomSelect.value;
        const details = detailsSelect.value;

        // ✅ ตรวจสอบว่าข้อมูลครบหรือไม่
        if (!equipment || !room || !details) {
            alert("กรุณากรอกข้อมูลให้ครบถ้วน");
            return;
        }

        let imageData = "";
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];

            // ✅ ตรวจสอบประเภทไฟล์ (อนุญาตเฉพาะไฟล์รูปภาพ)
            if (!file.type.startsWith("image/")) {
                alert("กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ (JPEG, PNG, GIF)");
                return;
            }

            // ✅ ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
            if (file.size > 5 * 1024 * 1024) { 
                alert("ขออภัย ขนาดไฟล์รูปภาพใหญ่เกินไป (ต้องไม่เกิน 5MB)");
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                imageData = e.target.result;
                saveReport(equipment, room, details, imageData);
            };
            reader.readAsDataURL(file);
        } else {
            saveReport(equipment, room, details, imageData);
        }
    });

    // 📝 ฟังก์ชันบันทึกข้อมูลลง LocalStorage
    function saveReport(equipment, room, details, imageData) {
        let reports = JSON.parse(localStorage.getItem("reports")) || [];
        reports.push({
            equipment,
            room,
            details,
            image: imageData,
            date: new Date().toLocaleString()
        });
        localStorage.setItem("reports", JSON.stringify(reports));

        // ✅ ใช้ confirm() ให้ผู้ใช้ยืนยันก่อนเปลี่ยนหน้า
        if (confirm("รายงานปัญหาสำเร็จ! ต้องการกลับไปที่หน้าหลักหรือไม่?")) {
            window.location.href = "home.html";
        } else {
            reportForm.reset(); // รีเซ็ตฟอร์มโดยไม่เปลี่ยนหน้า
            previewImage.style.display = "none"; // ซ่อนตัวอย่างภาพ
        }
    }

    // 🔄 อัปเดตตัวเลือก "รายละเอียดเพิ่มเติม" ตามอุปกรณ์ที่เลือก
    equipmentSelect.addEventListener("change", function () {
        const equipment = equipmentSelect.value;
        detailsSelect.innerHTML = '<option value="">-- กรุณาเลือก --</option>';

        const problems = {
            "สายไฟ": ["สายไฟชำรุด", "สายไฟขาด", "ปลั๊กไฟหลวม"],
            "เก้าอี้": ["ขาเก้าอี้หัก", "เบาะชำรุด", "พนักพิงหลุด"],
            "โต๊ะ": ["ขาโต๊ะหัก", "พื้นโต๊ะมีรอย", "โต๊ะโยก"],
            "จอคอมพิวเตอร์": ["หน้าจอไม่ติด", "จอมีรอยแตก", "ภาพไม่ชัด"],
            "โปรเจคเตอร์": ["โปรเจคเตอร์ไม่ติด", "ภาพเบลอ", "รีโมทไม่ทำงาน"],
            "ทีวี": ["ทีวีไม่ติด", "เสียงไม่ออก", "จอภาพไม่ชัด"],
            "เครื่องปรับอากาศ": ["ไม่มีความเย็น", "มีน้ำหยด", "เปิดไม่ติด"],
            "วิชวลไลเซอร์": ["เครื่องไม่ทำงาน", "แสงไม่ออก", "ภาพไม่ขึ้น"],
            "hub": ["พอร์ตไม่ทำงาน", "ไฟไม่ติด", "อุปกรณ์ไม่เชื่อมต่อ"],
            "router": ["ไม่มีสัญญาณ", "ไฟไม่ติด", "เชื่อมต่อช้า"],
            "switch": ["พอร์ตไม่ทำงาน", "อุปกรณ์ไม่ตอบสนอง", "ไฟสถานะไม่ขึ้น"],
            "พอยเตอร์": ["แบตเตอรี่หมด", "แสงไม่ออก", "ปุ่มกดเสีย"],
            "เมาส์": ["ปุ่มคลิกไม่ทำงาน", "ตัวชี้เมาส์ไม่ขยับ", "สายเมาส์ชำรุด"],
            "คีย์บอร์ด": ["ปุ่มกดไม่ติด", "ปุ่มบางตัวหลุด", "แสงไฟไม่ติด"],
            "ปลั๊กไฟ": ["ปลั๊กไฟชำรุด", "สายไฟหลวม", "ไฟไม่ออก"],
            "เสียงไมค์": ["ไมค์ไม่มีเสียง", "เสียงขาดหาย", "ไมค์ไม่เชื่อมต่อ"],
            "คอมพิวเตอร์": ["เครื่องไม่เปิด", "หน้าจอไม่แสดงผล", "คีย์บอร์ดหรือเมาส์ไม่ตอบสนอง"]
        };

        if (problems[equipment]) {
            problems[equipment].forEach(problem => {
                const option = document.createElement("option");
                option.value = problem;
                option.textContent = problem;
                detailsSelect.appendChild(option);
            });
        } else {
            alert("ไม่มีปัญหาที่กำหนดไว้สำหรับอุปกรณ์นี้ กรุณากรอกรายละเอียดเพิ่มเติมในช่องหมายเหตุ");
        }
    });

    // 📸 ฟังก์ชันแสดงตัวอย่างภาพที่อัปโหลด
    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                previewImage.style.maxWidth = "300px"; // ปรับขนาดภาพให้ไม่เกิน 300px
                previewImage.style.maxHeight = "200px"; // ปรับความสูงให้ไม่เกิน 200px
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.style.display = "none"; // ซ่อนภาพหากไม่มีไฟล์
        }
    });
    
});
document.addEventListener("DOMContentLoaded", async function () {
    await fetchUserInfo();
  });
  
  // ✅ ฟังก์ชันดึงข้อมูลเซสชันผู้ใช้
  async function fetchUserInfo() {
    try {
        console.log("🔄 กำลังโหลดข้อมูลเซสชัน...");
        const response = await fetch("http://localhost:3000/session", {
            method: "GET",
            credentials: "include"
        });
  
        console.log("📡 API ตอบกลับ:", response.status);
        if (!response.ok) {
            throw new Error("Session expired");
        }
  
        const userSession = await response.json();
        console.log("✅ ข้อมูลผู้ใช้ที่ได้จาก API:", userSession);
  
        // ตรวจสอบว่า userSession มีข้อมูลที่ถูกต้อง
        if (!userSession || !userSession.data) {
            alert("กรุณาเข้าสู่ระบบใหม่");
            window.location.href = "login.html";
            return;
        }
  
        // ✅ ถ้าไม่มี `id="user-name"` ให้ข้ามไปเลย (ไม่แสดง warning)
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
            userNameElement.textContent = userSession.data.Name;
        }
  
    } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูลเซสชัน:", error);
        alert("เกิดข้อผิดพลาด กรุณาเข้าสู่ระบบใหม่");
        window.location.href = "login.html";
    }
  }
  // ✅ ฟังก์ชันออกจากระบบ
  async function logout() {
    try {
        console.log("🔄 กำลังออกจากระบบ...");
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include"
        });
  
        if (response.ok) {
            console.log("✅ ออกจากระบบสำเร็จ");
            alert("ออกจากระบบสำเร็จ");
            window.location.href = "login.html"; // 🔹 ส่งผู้ใช้กลับไปที่หน้า login
        } else {
            console.error("❌ เกิดข้อผิดพลาดในการออกจากระบบ");
            alert("เกิดข้อผิดพลาดในการออกจากระบบ กรุณาลองใหม่");
        }
    } catch (error) {
        console.error("❌ ไม่สามารถออกจากระบบได้:", error);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  }
  
  // ✅ ผูกปุ่ม "ออกจากระบบ" กับฟังก์ชัน logout()
  document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
  });
