
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contestant Status Update</title>
</head>
<body style="margin:0; padding:0; background:#f4f6f9; font-family:Arial,sans-serif; color:#333;">

    <div style="max-width:600px; margin:30px auto; background:#fff; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">

        <div style="background:#1e3a8a; color:#fff; padding:25px; text-align:center;">
            <h1 style="margin:0; font-size:24px;">Contestant Notification</h1>
        </div>

        <div style="padding:30px;">
            <p>Hello {{ $contestant->full_name }},</p>

            <p>
                We are writing to inform you that your
                <strong>{{ $updateType === 'payment status' ? 'payment status' : 'application status' }}</strong>
                has been updated.
            </p>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:20px; margin:25px 0;">
                <p style="margin:0 0 10px;">
                    <strong>Previous status:</strong>
                    {{ ucfirst($oldValue) }}
                </p>

                <p style="margin:0;">
                    <strong>New status:</strong>
                    <span style="font-weight:bold; color:#1d4ed8;">
                        {{ ucfirst($newValue) }}
                    </span>
                </p>
            </div>

            @if ($updateType === 'status' && $newValue === 'approved')
                <p>Congratulations! Your contestant application has been approved.</p>
            @elseif ($updateType === 'status' && $newValue === 'rejected')
                <p>Unfortunately, your contestant application has been rejected. Please contact the administration if you need further clarification.</p>
            @elseif ($updateType === 'status' && $newValue === 'pending')
                <p>Your contestant application is currently pending review.</p>
            @elseif ($updateType === 'payment status' && $newValue === 'paid')
                <p>We have confirmed that your payment has been received.</p>
            @elseif ($updateType === 'payment status' && $newValue === 'pending')
                <p>Your payment is currently marked as pending. Please contact the administration if you believe this is incorrect.</p>
            @endif

            <p>If you have any questions, please contact the election administration.</p>

            <p style="margin-top:30px;">
                Kind regards,<br>
                <strong>Election Administration Team</strong>
            </p>
        </div>

        <div style="background:#f1f5f9; padding:15px; text-align:center; font-size:12px; color:#64748b;">
            This is an automated notification. Please do not reply directly to this email.
        </div>

    </div>

</body>
</html>
