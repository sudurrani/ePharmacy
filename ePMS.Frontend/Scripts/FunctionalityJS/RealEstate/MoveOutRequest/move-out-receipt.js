$(document).ready(function () {
    $(".dropdown-item").click(function () {
        var text = $(this).text();
        if (text === "Cash") {
            debugger
            var description = "", propertyName = [], unitNo = null;;

            if ($('#LeaseAgreementID').val() == null || $('#LeaseAgreementID').val() == 0) {
                infoToastr("Please select an agreement first", 'info');
                return;
            } else {
                $('#PropertyUnitsDetailTable tbody tr').each(function () {
                    var prop = $(this).find('td.tdProperty').text();
                    var unit = $(this).find('td.tdUnitNo').text();

                    if (!propertyName.includes(prop)) {
                        propertyName.push(prop);
                    }
                    unitNo = unitNo == null ? $(this).find('td.tdUnitNo').text() : (unitNo + ', ' + $(this).find('td.tdUnitNo').text());
                });
                let leaseAgreement;
                if ($('#LeaseAgreementID').is('select') > 0) {
                    leaseAgreement = $('#LeaseAgreementID option:selected').text()
                } else {
                    leaseAgreement = $('#AgreementNo').val();
                }
                description += "Property(s): " + propertyName.join(', ') + ", Unit No(s): " + unitNo + ", Agreement: " + leaseAgreement;

                $('#CRVModal').modal('show');
                let securityDeposit = $('#SecurityDeposit').val();
                $("#CRVtxtPaymentAmount").val(securityDeposit);
                $('#CRVtxtTitle').val(description);

            }
            
        }
        else if (text === "Bank") {
            debugger
            var description = "", propertyName = [], unitNo = null;;

            if ($('#LeaseAgreementID').val() == null || $('#LeaseAgreementID').val() == 0) {
                infoToastr("Please select an agreement first", 'info');
                return;
            } else {
                $('#PropertyUnitsDetailTable tbody tr').each(function () {
                    var prop = $(this).find('td.tdProperty').text();
                    var unit = $(this).find('td.tdUnitNo').text();

                    if (!propertyName.includes(prop)) {
                        propertyName.push(prop);
                    }
                    unitNo = unitNo == null ? $(this).find('td.tdUnitNo').text() : (unitNo + ', ' + $(this).find('td.tdUnitNo').text());
                });
                let leaseAgreement;
                if ($('#LeaseAgreementID').is('select') > 0) {
                    leaseAgreement = $('#LeaseAgreementID option:selected').text()
                } else {
                    leaseAgreement = $('#AgreementNo').val();
                }
                description += "Property(s): " + propertyName.join(', ') + ", Unit No(s): " + unitNo + ", Agreement: " + leaseAgreement;

                $('#BPVSaveModal').modal('show');
                let securityDeposit = $('#SecurityDeposit').val();
                $("#BPVtxtPaymentAmount").val(securityDeposit);
                $('#BPVtxtBenificaryAmount').val(securityDeposit);
                $('#BPVtxtTitle').val(description);

            }
        }
    });   

});



