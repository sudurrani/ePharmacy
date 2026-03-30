$(document).ready(function () {
  $(".custom-accordion").on("click", function () {
    const currentContent = $(this).next(".custom-accordion-content");
    const currentIcon = $(this).find("i");

  
    $(".custom-accordion-content").not(currentContent).slideUp(200);
    $(".custom-accordion i")
      .not(currentIcon)
      .removeClass("fa-minus")
      .addClass("fa-plus");

   
    currentContent.slideToggle(200);
    currentIcon.toggleClass("fa-plus fa-minus");
  });

  // Handle Enter key in input
  $(".filter-input").on("keydown", function (e) {
    if (e.key === "Enter") {
      const inputText = $(this).val().trim();
      const $section = $(this).closest(".input-section");
      const filterType = $section.find(".FilterType").val();
      if (
        filterType == "Blank" ||
        filterType == "NotBlank" ||
        inputText !== ""
      ) {
        const checkbox = $('<input type="checkbox" />')
          .attr("data-filter", filterType)
          .on("change", function () {
            handleFilterCheckboxChange($(this));
          });

        if (filterType == "Blank" || filterType == "NotBlank") {
          inputText = "";
        }
        const labelText = `${filterType} "${inputText}"`;
        const label = $("<span></span>").text(labelText);

        const newItem = $('<div class="result-item"></div>')
          .append(checkbox)
          .append(label);
        newItem.append(checkbox).append(label);

        $section.find(".results-container").append(newItem);

        $(this).val("");
        $section.find(".search-bar").val("").show();
      }
    }
  });

  // Filter results
  $("#search-bar").on("input", function () {
    const query = $(this).val().toLowerCase();
    $(".result-item").each(function () {
      const text = $(this).find("span").text().toLowerCase();
      $(this).toggle(text.includes(query));
    });
  });
});
// accordion

function handleFilterCheckboxChange($checkbox) {
  const isChecked = $checkbox.is(":checked");
  const labelText = $checkbox.siblings("span").text();

  (
    `Checkbox for "${labelText}" is now ${isChecked ? "checked" : "unchecked"}.`
  );


}
/*====================sorting js ===============*/
document.querySelectorAll(".sort-icon").forEach((icon) => {
  icon.addEventListener("click", function () {
    const table = document.querySelectorAll(".bhaexampletable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const index = parseInt(this.dataset.index);

    // Determine current direction
    const isAsc =
      this.classList.contains("bi-chevron-expand") ||
      this.classList.contains("bi-chevron-down");

    // Clear all icons
    document.querySelectorAll(".sort-icon").forEach((i) => {
      i.classList.remove("bi-chevron-up", "bi-chevron-down");
      i.classList.add("bi-chevron-expand");
    });

    // Sort logic
    rows.sort((a, b) => {
      const A = a.children[index].innerText.trim().toLowerCase();
      const B = b.children[index].innerText.trim().toLowerCase();

      const isNumeric = !isNaN(A) && !isNaN(B);
      if (isNumeric) {
        return isAsc ? A - B : B - A;
      } else {
        return isAsc ? A.localeCompare(B) : B.localeCompare(A);
      }
    });

    // Apply new icon
    this.classList.remove("bi-chevron-expand");
    this.classList.add(isAsc ? "bi-chevron-up" : "bi-chevron-down");

    // Re-insert rows
    rows.forEach((row) => tbody.appendChild(row));
  });
});
/* =========================filter product js =====================*/

// ================filters  dropdown js============
// both clicking function handle script

function openTab(evt, tabName) {
  evt.preventDefault(); // prevent anchor default behavior
  evt.stopPropagation(); // stop dropdown from closing
const table = $(".example").DataTable({
          orderCellsTop: true,
          fixedHeader: true,
          searching: false,
          dom:
            "t" + // Table
            "<'row mt-3 align-items-center bg-light rouded shadow-sm py-1'" +
            "<'col-sm-4'l>" + // Length (Show entries)
            "<'col-sm-4 text-center'i>" + // Info
            "<'col-sm-4 text-end'p>" + // Pagination
            ">",
        });
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.classList.add("active");
}
document.addEventListener("DOMContentLoaded", function () {
  var a = document.getElementById("defaultOpen");
  if (a) a.click();
});

/* entries */
function dragstartHandler(ev, label, iconClass) {
  const data = JSON.stringify({ label, iconClass });
  ev.dataTransfer.setData("text/plain", data);
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function dragenterHandler(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add("drop-highlight");
}

function dragleaveHandler(ev) {
  ev.currentTarget.classList.remove("drop-highlight");
}

function dropHandler(ev) {
  ev.preventDefault();
  const data = JSON.parse(ev.dataTransfer.getData("text/plain"));
  const dropContainer = ev.currentTarget;

  // Remove placeholder
  const placeholder = dropContainer.querySelector(".placeholder");
  if (placeholder) placeholder.remove();

  // Create new dropped item
  const item = document.createElement("div");
  item.className = "dropped-item";

  const leftPart = document.createElement("div");
  leftPart.className = "dropped-left";

  const icon = document.createElement("i");
  icon.className = data.iconClass;

  const label = document.createElement("span");
  label.textContent = data.label;

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.innerHTML = "&times;";
  removeBtn.onclick = function () {
    item.remove();
    if (dropContainer.children.length === 0) {
      const ph = document.createElement("div");
      ph.className = "placeholder";
      ph.textContent = "Drag here to set row groups";
      dropContainer.appendChild(ph);
    }
  };

  leftPart.appendChild(icon);
  leftPart.appendChild(label);
  item.appendChild(leftPart);
  item.appendChild(removeBtn);

  dropContainer.appendChild(item);
  dropContainer.classList.remove("drop-highlight");
}
/* filter created javascript */
/* pagination */

/* pagination */
$(document).ready(function () {    
    const table = $(".bhaexampletable").DataTable({
        orderCellsTop: true,
        fixedHeader: true,
        searching: true,
        pagingType: "simple",
        lengthMenu: [10, 25, 50, 100],
        pageLength: 100,
        ordering: true,
        dom:
            "t" +
            "<'row mt-3 align-items-center'" +
            "<'col-sm-6'l>" +
            "<'col-sm-6 custom-pagination-controls'>" +
            ">",
        buttons: [
            { extend: "copy", name: "copy" },
            { extend: "print", name: "print" },
            // you can add more (excel, csv, pdf etc.)
        ],
        columndefs: [
            {
                targets: "_all",
                orderable: false,
            }
        ],
        drawCallback: function (settings) {
            const api = this.api();
            const pageInfo = api.page.info();
            const currentPage = pageInfo.page + 1;
            const totalPages = pageInfo.pages;
            const startRow = pageInfo.start + 1;
            const endRow = pageInfo.end;
            // Reset all icons
            $(".bhaexampletable thead tr:eq(1) td i")
                .removeClass("bi-chevron-up bi-chevron-down")
                .addClass("bi-chevron-expand");
            //Apply correct icon to sorted column
            const order = api.order();
            if (order.length > 0) {
                const colIndex = order[0][0];
                const direction = order[0][1];
                const $icon = $(".bhaexampletable thead tr:eq(1) td").eq(colIndex).find("i");
                if (direction === "asc") {
                    $icon.removeClass("bi-chevron-expand").addClass("bi-chevron-up");
                } else {
                    $icon.removeClass("bi-chevron-expand").addClass("bi-chevron-down");
                }
            }
            // Custom Pagination
            let html = `
            <button class="first-page" ${currentPage === 1 ? "disabled" : ""}>
                <i class="bi bi-chevron-bar-left"></i>
            </button>
            <button class="prev-page" ${currentPage === 1 ? "disabled" : ""}>
                <i class="bi bi-chevron-left"></i>
            </button>
            <span class="page-text">Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong></span>
            <button class="next-page" ${currentPage === totalPages ? "disabled" : ""}>
                <i class="bi bi-chevron-right"></i>
            </button>
            <button class="last-page" ${currentPage === totalPages ? "disabled" : ""}>
                <i class="bi bi-chevron-bar-right"></i>
            </button>
        `;
            let paginationControls = `
            <div class="pagination-wrapper">
                <div class="entries-text">Showing ${startRow} to ${endRow} of ${pageInfo.recordsTotal} entries</div>
            </div>
        `;
            $(".custom-pagination-controls").html(html + paginationControls);
            // Pagination Button Events
            $(".first-page").off().on("click", function () {
                api.page("first").draw("page");
            });
            $(".prev-page").off().on("click", function () {
                api.page("previous").draw("page");
            });
            $(".next-page").off().on("click", function () {
                api.page("next").draw("page");
            });
            $(".last-page").off().on("click", function () {
                api.page("last").draw("page");
            });
            $(".pagination-wrapper").css({
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
            });
            // Dropdown change
            const lengthControl = $(".dataTables_length select");
            lengthControl.on("change", function () {
                const newLength = $(this).val();
                api.page.len(newLength).draw();
            });
        }
    });
    // ? Custom Sorting via icons in 2nd thead row
    $(".bhaexampletable thead tr:eq(1) td i").on("click", function () {
        const $icon = $(this);
        const colIndex = $icon.closest("td").index(); // Column index
        const currentOrder = table.order();
        const currentCol = currentOrder[0]?.[0];
        const currentDir = currentOrder[0]?.[1];
        // Toggle direction
        const newDir = (currentCol === colIndex && currentDir === "asc") ? "desc" : "asc";
        // Apply sorting
        table.order([colIndex, newDir]).draw();
    });

    // Move the "Show X entries" part manually to the left column
    $(".dataTables_length").appendTo(".col-sm-6.l");
    //Initialize DataTable with export buttons onlyexample

    // Export dropdown toggle
    $("#exportToggle").on("click", function () {
        $("#exportMenu").toggle();
    });
    // Close dropdown when clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest(".export-dropdown").length) {
            $("#exportMenu").hide();
        }
    });
    // Export buttons click handlers
    $("#exportMenu span").on("click", function () {
        const exportType = $(this).data("export");
        const buttonNameMap = {
            copy: "copy",
            print: "print",
        };
        const btnName = buttonNameMap[exportType];
        if (btnName) {
            table.button(btnName + ":name").trigger();
        }
        $("#exportMenu").hide();
    });

});
/* selected row */
