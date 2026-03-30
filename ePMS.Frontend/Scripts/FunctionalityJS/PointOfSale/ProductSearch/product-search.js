
$(document).ready(function () {
    $("#ProductTypeID,#ItemTypeID,#DivisionID").select2({
        width: "100%",
        //placeholder: "Select an option",
        minimumResultsForSearch: 0,
    });
    $(".mutiple_sel").select2({ width: "style" });
    loadProductTypeDropdownList('ProductTypeID', 0, 'Item', 'ItemTypeID', function () { 
        _isFromServer = true;
        loadTableData();

    });
    loadDivisionDropdownList('DivisionIDs', 0, 'Select Division');
    $('#DivisionIDs').on('select2:select select2:unselect', function () {
        _isFromServer = true;
        loadTableData();
    });    
    $('#ProductTypeID').on('select2:select', function () {
        loadItemTypeDropdownList('ItemTypeID', 0, null, $(this).val(), function () {
            _isFromServer = true;
            loadTableData();
        });       
    });
    $('#ItemTypeID').on('select2:select', function () {   
        _isFromServer = true;
        loadTableData();
    });
   
    $('#btnClearFilter').click(function () {
        //$("#ProductTypeID").val(0).trigger("change");
        //$("#ItemTypeID").val(0).trigger("change");
        loadProductTypeDropdownList('ProductTypeID', 0, 'Item', 'ItemTypeID', function () {
            loadTableData();

        });
        $("#DivisionIDs").val([]).change();
        //loadTableData();
        loadDivisionDropdownList();
        $("#globalSearch").val('');
        $("#addGlobalSearch").val('');
    });   

    $(document).on("click", ".availableQTY", function () { 
        let $row = $(this).closest("tr");
        openVariantModal($row);
       
    });
    $(document).on("click", ".btnAddCart", function () {       
            let $row = $(this).closest("tr");
            openVariantQuantityModal($row);       
    });  
    
    $(document).on("click", ".product-img", function () {
        let imgSrc = $(this).attr("src");
        $("#imagePreviewModal").modal("show");
        $("#modalPreviewImage").attr("src", imgSrc);

    });  
});
function closeImagePreviewModal() {
    $('#imagePreviewModal').modal('hide');
}
