@echo off
echo ================================================
echo   Importing Coupons to MongoDB Atlas
echo ================================================
echo.

mongoimport --uri "mongodb+srv://aloweda_admin:Aloweda2024@cluster0.zvplwpb.mongodb.net/aloweda" --collection coupons --file coupons-import.json --jsonArray

echo.
echo ================================================
echo   Import Complete!
echo ================================================
pause
