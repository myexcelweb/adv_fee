// script.js -  Updated for  notification msg  and calculation continuation

// Helper function to format numbers in Indian style
function formatIndianNumber(number) {
    var num = number.toString();
    var decimalPart = '';
    if (num.includes('.')) {
        [num, decimalPart] = num.split('.');
        decimalPart = '.' + decimalPart;
    }

    var lastThree = num.substring(num.length - 3);
    var otherNumbers = num.substring(0, num.length - 3);

    if (otherNumbers != '') {
        lastThree = ',' + lastThree;
    }

    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + decimalPart;
    return res;
}

$(document).ready(function () {
    // Initialize Section 1 as visible and Section 2 as hidden
    $('#section2').hide();

    // Toggle Switch Functionality
    $('#toggleCalculator').change(function () {
        $('#section1').toggle();
        $('#section2').toggle();
    });

    // Prevent form submission on Enter key in section 2 and move to the next field.
    $('#section2').keydown(function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            if (document.activeElement.id === 'introducedAmount') {
                $('#approvedAmount').focus();
            }
        }
    });

    //-------------------- Section 1 Javascript --------------------

    $('#amount').on('input', function () {
        var amount = parseFloat($(this).val());

        if (!isNaN(amount)) {
            //** Replace this with your actual calculation logic based on tables **
            var calculationResults = calculateFeesSection1(amount); // Calls local JS function

            var courtFee = calculationResults.courtFee;
            var advocateFee = calculationResults.advocateFee;
            var totalAmount = amount + courtFee + advocateFee;

            // Display Values
            $('#amount_value').text('₹ ' + formatIndianNumber(amount.toFixed(2)));
            $('#court_fee').text('₹ ' + formatIndianNumber(courtFee.toFixed(2)));
            $('#advocate_fee').text('₹ ' + formatIndianNumber(advocateFee.toFixed(2)));
            $('#total_amount').text('₹ ' + formatIndianNumber(totalAmount.toFixed(2)));

            // Check if court fee is ₹75,000 or more. If so, display the warning.
            if (courtFee >= 75000) {
                $('#court_fee').css('color', 'red'); // Set text color to red
                $('#court_fee_info').show(); // Show info message
            } else {
                $('#court_fee').css('color', 'green'); // Reset to green
                $('#court_fee_info').hide(); // Hide info message
            }

        } else {
            // Clear the results if the input is invalid
            clearSection1();
        }
    });

    function clearSection1() {
        $('#amount_value').text('₹ 0.00');
        $('#court_fee').text('₹ 0.00');
        $('#advocate_fee').text('₹ 0.00');
        $('#total_amount').text('₹ 0.00');

        $('#court_fee').css('color', 'green'); // Reset to green
        $('#court_fee_info').hide(); // Hide info message
    }

    //-------------------- Section 2 Javascript --------------------

    $('#introducedAmount, #approvedAmount').on('input', function () {
        calculateFeesSection2();
    });

    function calculateFeesSection2() {
        var introducedAmount = parseFloat($('#introducedAmount').val());
        var approvedAmount = parseFloat($('#approvedAmount').val());

        if (!isNaN(introducedAmount) && !isNaN(approvedAmount)) {
            // ** Replace this with your actual calculation logic based on tables **
            var calculationResults = calculateFeesSection2Calc(introducedAmount, approvedAmount); //Calls local JS Function

            displayCalculationSection2(calculationResults, introducedAmount, approvedAmount);

          // Check if court fee is ₹75,000 or more. If so, display the warning.
            if (calculationResults.courtFee >= 75000) {
                $('#court_fee_approved').css('color', 'red'); // Set text color to red
                $('#court_fee_info_approved').show(); // Show info message
            } else {
                $('#court_fee_approved').css('color', 'green'); // Reset to green
                $('#court_fee_info_approved').hide(); // Hide info message
            }

        } else {
            clearSection2();
        }
    }

    function displayCalculationSection2(result, introducedAmount, approvedAmount) {
        var courtFee = result.courtFee || 0;
        var advocateFee = result.advocateFee || 0;
        var totalAmount = approvedAmount + courtFee + advocateFee;

        // Update second table
        $('#approved_value_different').text('₹ ' + formatIndianNumber(approvedAmount.toFixed(2)));
        $('#court_fee_approved').text('₹ ' + formatIndianNumber(courtFee.toFixed(2)));
        $('#advocate_fee_approved').text('₹ ' + formatIndianNumber(advocateFee.toFixed(2)));
        $('#total_amount_approved').text('₹ ' + formatIndianNumber(totalAmount.toFixed(2)));
    }

    function clearSection2() {
        $('#approved_value_different').text('₹ 0.00');
        $('#court_fee_approved').text('₹ 0.00');
        $('#advocate_fee_approved').text('₹ 0.00');
        $('#total_amount_approved').text('₹ 0.00');

        $('#court_fee_approved').css('color', 'green'); // Reset to green
        $('#court_fee_info_approved').hide(); // Hide info message
    }

    // ------ Calculation Functions (Replace with your actual table lookups) ------
    function calculateFeesSection1(amount) {
        const courtFeeTable = getCourtFeeTable();
        const advocateFeeTable = getAdvocateFeeTable();

        const courtFee = calculateFee(amount, courtFeeTable);
        const advocateFee = calculateFee(amount, advocateFeeTable);

        return {
            courtFee: courtFee,
            advocateFee: advocateFee
        };
    }

    function calculateFeesSection2Calc(introducedAmount, approvedAmount) {
        const courtFeeTable = getCourtFeeTable();
        const advocateFeeTable = getAdvocateFeeTable();

        const courtFee = calculateFee(introducedAmount, courtFeeTable);
        const advocateFee = calculateFee(approvedAmount, advocateFeeTable);

        return {
            courtFee: courtFee,
            advocateFee: advocateFee
        };
    }

    function calculateFee(amount, feeTable) {
        for (let i = 0; i < feeTable.length; i++) {
            const row = feeTable[i];
            if (amount >= row[0] && amount <= row[1]) {
                if (typeof row[2] === 'function') {
                    return row[2](amount); // Handle dynamic fee calculation
                } else {
                    return row[2]; // Static fee
                }
            }
        }
        return 0; // Default fee if no match
    }

    // Add this to your existing script.js file

document.addEventListener('DOMContentLoaded', function() {
    // Initialize home button effects
    initHomeButton();
    
    // Your existing code below...
});

function initHomeButton() {
    const homeButton = document.querySelector('.home-button');
    
    if (homeButton) {
        // Add pulse animation on page load
        homeButton.classList.add('pulse');
        
        // Remove pulse animation after 2 seconds
        setTimeout(() => {
            homeButton.classList.remove('pulse');
        }, 2000);
        
        // Add click effect
        homeButton.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Position the ripple
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation completes
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }
}

});