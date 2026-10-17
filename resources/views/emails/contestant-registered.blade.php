<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Contestant Registration</title>
</head>
<body>
    <h2>New Contestant Registration</h2>

    <p>Hello,</p>

    <p>A new contestant has successfully registered.</p>

    <h3>Contestant Details</h3>

    <p><strong>Name:</strong> {{ $contestant->full_name }}</p>
    <p><strong>Email:</strong> {{ $contestant->email }}</p>
    <p><strong>Phone:</strong> {{ $contestant->phone_number }}</p>
    <p><strong>Address:</strong> {{ $contestant->address }}</p>
    <p><strong>Passport Number:</strong> {{ $contestant->passport_number }}</p>
    <p><strong>Status:</strong> {{ ucfirst($contestant->status) }}</p>

    <p>
        Please log in to the administration dashboard to review
        this contestant's registration.
    </p>

    <p>Thank you.</p>
</body>
</html>
