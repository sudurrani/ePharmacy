function calender_popup() {
    document.querySelectorAll(".calendar-wrapper").forEach((wrapper) => {
        if (wrapper.dataset.init === "true") return;
        wrapper.dataset.init = "true"; //mark as initalized

        var calendarDays = wrapper.querySelector(".calendar-days");
        var monthYear = wrapper.querySelector(".month-year");
        var prev = wrapper.querySelector(".prev");
        var next = wrapper.querySelector(".next");
        var popup = wrapper.querySelector(".calendar-popup");
        var selectedDateInput = wrapper.querySelector(".selected-date-input");
        var todayBtn = wrapper.querySelector(".goto-today");
        var monthGrid = wrapper.querySelector(".month-grid");
        var yearGrid = wrapper.querySelector(".year-grid");
        var daysHeader = wrapper.querySelector(".days-header");
        const pickerType = wrapper.dataset.pickerType || 'normal';

        // ✅ CHECK FOR DROPDOWN SELECTED MONTH/YEAR/DAY
        var targetMonth = wrapper.getAttribute('data-target-month');
        var targetYear = wrapper.getAttribute('data-target-year');
        var targetDay = wrapper.getAttribute('data-target-day'); // ✅ NEW

        let selectedDate = new Date();
        let selectedWeekStart = new Date();
        let selectedFortnightStart = new Date();
        let selectedYear = new Date().getFullYear();
        let selectedMonth = new Date().getMonth();
        let current = new Date();

        // ✅ Agar dropdown se month/year/day select hai to use that
        if (targetMonth !== null && targetYear !== null && targetMonth !== '' && targetYear !== '') {
            const month = parseInt(targetMonth);
            const year = parseInt(targetYear);
            const dayToUse = targetDay ? parseInt(targetDay) : 1; // ✅ Use specified day or default to 1

            current = new Date(year, month);
            selectedYear = year;
            selectedMonth = month;
            selectedDate = new Date(year, month, dayToUse); // ✅ Ab 12 select hoga
            selectedWeekStart = new Date(year, month, dayToUse);
            selectedFortnightStart = new Date(year, month, dayToUse);
            console.log("Calendar initialized with dropdown values - Month:", month, "Year:", year, "Day:", dayToUse);
        }

        function formatDate(date) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        function getWeekRange(startDate) {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        function getFortnightRange(startDate) {
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 13);
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        function getMonthRange(year, month) {
            const startDate = new Date(year, month, 1);
            const endDate = new Date(year, month + 1, 0);
            return `${formatDate(startDate)} - ${formatDate(endDate)}`;
        }
        function renderCalendar() {
            if (!calendarDays) return;
            calendarDays.style.display = "grid";
            if (monthGrid) monthGrid.style.display = "none";
            if (yearGrid) yearGrid.style.display = "none";
            if (daysHeader) daysHeader.style.display = "grid";
            var year = current.getFullYear();
            var month = current.getMonth();
            var firstDay = new Date(year, month, 1).getDay();
            var lastDate = new Date(year, month + 1, 0).getDate();
            if (pickerType === '1') {
                lastDate = Math.min(lastDate, 31);
            }
            calendarDays.innerHTML = "";
            if (monthYear) monthYear.textContent = current.toLocaleString("default", {
                month: "long",
                year: "numeric",
            });
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement("div");
                calendarDays.appendChild(empty);
            }
            const daysInRange = pickerType === '2' ? 7 : (pickerType === '3' ? 14 : 1);
            const maxDiffDays = pickerType === '2' ? 6 : (pickerType === '3' ? 13 : 0);
            const selectedStart = pickerType === '2' ? selectedWeekStart : (pickerType === '3' ? selectedFortnightStart : selectedDate);
            for (let d = 1; d <= lastDate; d++) {
                const dateEl = document.createElement("div");
                dateEl.className = "date";
                if (pickerType === '1') {
                    dateEl.classList.add("pre-selected");
                }
                dateEl.textContent = d;
                const thisDate = new Date(year, month, d);
                let isSelected = false;
                if (pickerType === '2' || pickerType === '3') {
                    if (selectedStart) {
                        const diffTime = thisDate.getTime() - selectedStart.getTime();
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        if (diffDays >= 0 && diffDays <= maxDiffDays) {
                            isSelected = true;
                        }
                    }
                } else {
                    if (selectedDate.toDateString() === thisDate.toDateString()) {
                        isSelected = true;
                    }
                }
                if (isSelected) {
                    dateEl.classList.add("selected");
                }
                // Clear previous onclick
                dateEl.onclick = null;
                if (pickerType === '2' || pickerType === '3') {
                    dateEl.onmouseenter = () => {
                        if (!calendarDays) return;
                        document.querySelectorAll('.hover-highlight').forEach(el => el.classList.remove('hover-highlight'));
                        const children = [...calendarDays.children];
                        const startIndex = children.indexOf(dateEl);
                        for (let i = 0; i < daysInRange && startIndex + i < children.length; i++) {
                            const cell = children[startIndex + i];
                            if (cell && cell.classList.contains('date')) {
                                cell.classList.add('hover-highlight');
                            }
                        }
                    };
                    dateEl.onmouseleave = () => {
                        document.querySelectorAll('.hover-highlight').forEach(el => el.classList.remove('hover-highlight'));
                    };
                    dateEl.onclick = () => {
                        if (pickerType === '2') {
                            selectedWeekStart = thisDate;
                            if (selectedDateInput) selectedDateInput.value = getWeekRange(thisDate);
                        } else {
                            selectedFortnightStart = thisDate;
                            if (selectedDateInput) selectedDateInput.value = getFortnightRange(thisDate);
                        }
                        if (popup) popup.style.display = "none";
                        renderCalendar();
                        if (selectedDateInput) selectedDateInput.dispatchEvent(new Event('change'));
                    };
                } else {
                    dateEl.onclick = () => {
                        selectedDate = thisDate;
                        if (selectedDateInput) selectedDateInput.value = formatDate(thisDate);
                        if (popup) popup.style.display = "none";
                        renderCalendar();
                        if (selectedDateInput) selectedDateInput.dispatchEvent(new Event('change'));
                    };
                }
                calendarDays.appendChild(dateEl);
            }
        }
        function renderMonthPicker() {
            if (!monthGrid) return;
            if (calendarDays) calendarDays.style.display = "none";
            monthGrid.style.display = "grid";
            if (yearGrid) yearGrid.style.display = "none";
            if (daysHeader) daysHeader.style.display = "none";
            monthGrid.innerHTML = "";
            const months = Array.from({ length: 12 }, (_, i) =>
                new Date(2000, i).toLocaleString("default", { month: "short" })
            );
            months.forEach((m, idx) => {
                const el = document.createElement("div");
                el.textContent = m;
                // Clear previous onclick
                el.onclick = null;
                if (pickerType === '4') {
                    if (idx === selectedMonth && current.getFullYear() === selectedYear) {
                        el.classList.add("selected");
                    }
                    el.onclick = () => {
                        selectedMonth = idx;
                        selectedYear = current.getFullYear();
                        if (selectedDateInput) selectedDateInput.value = getMonthRange(selectedYear, selectedMonth);
                        if (popup) popup.style.display = "none";
                        if (selectedDateInput) selectedDateInput.dispatchEvent(new Event('change'));
                    };
                } else {
                    el.onclick = () => {
                        current.setMonth(idx);
                        renderYearPicker();
                    };
                }
                monthGrid.appendChild(el);
            });
            if (monthYear) monthYear.textContent = current.getFullYear();
        }
        function renderYearPicker() {
            if (!yearGrid) return;
            if (calendarDays) calendarDays.style.display = "none";
            if (monthGrid) monthGrid.style.display = "none";
            yearGrid.style.display = "grid";
            if (daysHeader) daysHeader.style.display = "none";
            yearGrid.innerHTML = "";
            const currentYear = current.getFullYear();
            const startYear = currentYear - 6;
            for (let y = startYear; y < startYear + 12; y++) {
                const el = document.createElement("div");
                el.textContent = y;
                // Clear previous onclick
                el.onclick = null;
                if (pickerType === '4') {
                    if (y === selectedYear) {
                        el.classList.add("selected");
                    }
                    el.onclick = () => {
                        selectedYear = y;
                        current.setFullYear(y);
                        renderMonthPicker();
                    };
                } else {
                    el.onclick = () => {
                        current.setFullYear(y);
                        renderCalendar();
                    };
                }
                yearGrid.appendChild(el);
            }
            if (monthYear) monthYear.textContent = "Select Year";
        }
        // Close all popups except the current one
        function closeAllPopupsExcept(currentPopup) {
            document.querySelectorAll(".calendar-popup").forEach((popupEl) => {
                if (popupEl !== currentPopup) {
                    popupEl.style.display = "none";
                }
            });
        }
        // Clear and set input onclick
        if (selectedDateInput) {
            selectedDateInput.onclick = null;
            selectedDateInput.onclick = (e) => {
                if (!selectedDateInput) return;
                e.stopPropagation();

                // ✅ RE-CHECK for updated target month/year/day every time calendar opens
                var updatedTargetMonth = wrapper.getAttribute('data-target-month');
                var updatedTargetYear = wrapper.getAttribute('data-target-year');
                var updatedTargetDay = wrapper.getAttribute('data-target-day'); // ✅ NEW

                if (updatedTargetMonth !== null && updatedTargetYear !== null &&
                    updatedTargetMonth !== '' && updatedTargetYear !== '') {
                    const month = parseInt(updatedTargetMonth);
                    const year = parseInt(updatedTargetYear);
                    const dayToUse = updatedTargetDay ? parseInt(updatedTargetDay) : 1; // ✅ NEW

                    current = new Date(year, month);
                    selectedYear = year;
                    selectedMonth = month;
                    selectedDate = new Date(year, month, dayToUse); // ✅ Update selectedDate with day
                    console.log("Calendar opened with updated dropdown - Month:", month, "Year:", year, "Day:", dayToUse);
                }

                const isVisible = popup && popup.style.display === "block";
                closeAllPopupsExcept(popup);
                if (!isVisible) {
                    const rect = selectedDateInput.getBoundingClientRect();
                    let modal = selectedDateInput.closest(".modal") || document.body;
                    if (popup && popup.parentNode !== modal) {
                        modal.appendChild(popup);
                    }
                    if (popup) {
                        popup.style.position = "absolute";
                        popup.style.top = rect.top + selectedDateInput.offsetHeight + window.scrollY + "px";
                        popup.style.left = rect.left + window.scrollX + "px";
                        popup.style.zIndex = 99999;
                        popup.style.display = "block";
                    }
                    if (pickerType === '4') {
                        renderMonthPicker();
                    } else {
                        renderCalendar();
                    }
                } else {
                    if (popup) popup.style.display = "none";
                }
            };
        }
        // Clear and set monthYear onclick
        if (monthYear) {
            monthYear.onclick = null;
            monthYear.onclick = () => {
                if (calendarDays && calendarDays.style.display === "grid") {
                    renderMonthPicker();
                } else if (monthGrid && monthGrid.style.display === "grid") {
                    renderYearPicker();
                }
            };
        }
        // Clear and set prev onclick
        if (prev) {
            prev.onclick = null;
            prev.onclick = () => {
                if (calendarDays && calendarDays.style.display === "grid") {
                    current.setMonth(current.getMonth() - 1);
                    if (pickerType !== '4') {
                        renderCalendar();
                    } else {
                        renderMonthPicker();
                    }
                } else if (monthGrid && monthGrid.style.display === "grid") {
                    current.setFullYear(current.getFullYear() - 1);
                    renderMonthPicker();
                } else if (yearGrid && yearGrid.style.display === "grid") {
                    current = new Date(current.getFullYear() - 12, current.getMonth());
                    renderYearPicker();
                }
            };
        }
        // Clear and set next onclick
        if (next) {
            next.onclick = null;
            next.onclick = () => {
                if (calendarDays && calendarDays.style.display === "grid") {
                    current.setMonth(current.getMonth() + 1);
                    if (pickerType !== '4') {
                        renderCalendar();
                    } else {
                        renderMonthPicker();
                    }
                } else if (monthGrid && monthGrid.style.display === "grid") {
                    current.setFullYear(current.getFullYear() + 1);
                    renderMonthPicker();
                } else if (yearGrid && yearGrid.style.display === "grid") {
                    current = new Date(current.getFullYear() + 12, current.getMonth());
                    renderYearPicker();
                }
            };
        }
        // Clear and set todayBtn onclick
        if (todayBtn) {
            todayBtn.onclick = null;
            todayBtn.onclick = () => {
                const today = new Date();
                current = new Date(today.getFullYear(), today.getMonth());
                if (pickerType === '4') {
                    selectedYear = today.getFullYear();
                    selectedMonth = today.getMonth();
                    if (selectedDateInput) selectedDateInput.value = getMonthRange(selectedYear, selectedMonth);
                    renderMonthPicker();
                } else if (pickerType === '2') {
                    selectedWeekStart = today;
                    if (selectedDateInput) selectedDateInput.value = getWeekRange(today);
                    renderCalendar();
                } else if (pickerType === '3') {
                    selectedFortnightStart = today;
                    if (selectedDateInput) selectedDateInput.value = getFortnightRange(today);
                    renderCalendar();
                } else if (pickerType === '1') {
                    selectedDate = today;
                    if (selectedDateInput) selectedDateInput.value = formatDate(today);
                    renderCalendar();
                } else {
                    selectedDate = today;
                    if (selectedDateInput) selectedDateInput.value = formatDate(today);
                    renderCalendar();
                }
            };
        }
        // Initial setup
        if (pickerType === '4') {
            if (selectedDateInput) selectedDateInput.value = getMonthRange(selectedYear, selectedMonth);
            renderMonthPicker();
        } else if (pickerType === '2') {
            if (selectedDateInput) selectedDateInput.value = getWeekRange(selectedWeekStart);
            renderCalendar();
        } else if (pickerType === '3') {
            if (selectedDateInput) selectedDateInput.value = getFortnightRange(selectedFortnightStart);
            renderCalendar();
        } else {
            if (selectedDateInput) selectedDateInput.value = formatDate(selectedDate);
            renderCalendar();
        }
    });
}