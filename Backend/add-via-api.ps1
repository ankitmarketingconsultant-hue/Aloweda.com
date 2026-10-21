# PowerShell script to add coupons via API

Write-Host "🎟️  Aloweda Coupon Import Tool" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Configuration
$apiUrl = Read-Host "Enter Backend URL (default: http://localhost:5000)"
if ([string]::IsNullOrWhiteSpace($apiUrl)) {
    $apiUrl = "http://localhost:5000"
}

$token = Read-Host "Enter Admin JWT Token (from localStorage)"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "`n❌ Token is required!" -ForegroundColor Red
    Write-Host "To get token:" -ForegroundColor Yellow
    Write-Host "1. Login as admin in browser" -ForegroundColor Yellow
    Write-Host "2. Open console (F12)" -ForegroundColor Yellow
    Write-Host "3. Type: localStorage.getItem('token')" -ForegroundColor Yellow
    pause
    exit
}

# Coupons data
$coupons = @(
    @{
        code = "BJA899"
        description = "Buy any 3 products at ₹899 - Combo Deal"
        type = "fixed"
        discount = 0
        minOrderValue = 0
        usageLimit = $null
        perUserLimit = 10
        validFrom = "2026-10-21T00:00:00.000Z"
        validTo = "2025-12-31T23:59:59.999Z"
        isActive = $true
        source = "Excel Import"
        campaign = "Combo Deals 2025"
    },
    @{
        code = "B4A1199"
        description = "Buy any 4 products at ₹1199 - Combo Deal"
        type = "fixed"
        discount = 0
        minOrderValue = 0
        usageLimit = $null
        perUserLimit = 10
        validFrom = "2026-10-21T00:00:00.000Z"
        validTo = "2025-12-31T23:59:59.999Z"
        isActive = $true
        source = "Excel Import"
        campaign = "Combo Deals 2025"
    },
    @{
        code = "B2A699"
        description = "Buy any 2 products at ₹699 - Combo Deal"
        type = "fixed"
        discount = 0
        minOrderValue = 0
        usageLimit = $null
        perUserLimit = 10
        validFrom = "2026-10-21T00:00:00.000Z"
        validTo = "2025-12-31T23:59:59.999Z"
        isActive = $true
        source = "Excel Import"
        campaign = "Combo Deals 2025"
    }
)

Write-Host "`n🔄 Starting import...`n" -ForegroundColor Yellow

foreach ($coupon in $coupons) {
    Write-Host "Adding: $($coupon.code)..." -ForegroundColor Cyan
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Authorization" = "Bearer $token"
        }
        
        $body = $coupon | ConvertTo-Json -Depth 10
        
        $response = Invoke-RestMethod -Uri "$apiUrl/api/coupons" -Method Post -Headers $headers -Body $body
        
        if ($response.success) {
            Write-Host "✅ $($coupon.code) added successfully!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($response.message)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host "`n🎉 Import completed!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
pause
