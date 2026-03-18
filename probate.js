// probate_script.js - Probate Court Fee Calculation Logic (Single Value)

$(document).ready(function () {

    const MAX_COURT_FEE = 75000;

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

    function calculateCourtFee(value) {
        if (value <= 1000) return 0;
        if (value <= 50000) return (value - 1000) * 0.02;
        if (value <= 200000) return (50000 - 1000) * 0.02 + (value - 50000) * 0.04;
        if (value <= 300000) return (50000 - 1000) * 0.02 + (200000 - 50000) * 0.04 + (value - 200000) * 0.06;
        return Math.min((50000 - 1000) * 0.02 + (200000 - 50000) * 0.04 + (300000 - 200000) * 0.06 + (value - 300000) * 0.075, 75000);
    }

    $('#amount').on('input', function () {
        let suitValue = parseFloat($(this).val());

        if (isNaN(suitValue) || suitValue < 0) {
            $('#amount_value').text("Invalid Input");
            $('#court_fee').text("-");
            $('#total_amount').text("-");

            $('#amount_value').css('color', 'inherit');
            $('#court_fee').css('color', 'inherit');
            $('#total_amount').css('color', 'inherit');

            $('#court_fee_info').hide();
            return;
        }

        let fee = calculateCourtFee(suitValue);

        $('#amount_value').text('₹' + formatIndianNumber(suitValue.toFixed(2)));
        $('#court_fee').text('₹' + formatIndianNumber(fee.toFixed(2)));
        $('#total_amount').text('₹' + formatIndianNumber((suitValue + fee).toFixed(2)));

        // All amount value to green
        $('#amount_value').css('color', 'green');
        $('#court_fee').css('color', 'green');
        $('#total_amount').css('color', 'green');

        if (fee >= MAX_COURT_FEE) {
            $('#court_fee').css('color', 'red');
            $('#court_fee_info').show();
        } else {
            $('#court_fee').css('color', 'green');
            $('#court_fee_info').hide();
        }
    });

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