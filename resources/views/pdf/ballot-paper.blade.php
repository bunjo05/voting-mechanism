
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <title>Official Ballot Paper</title>

    <style>
        @page {
            margin: 28px 30px 42px 30px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            color: #1e293b;
            font-size: 10px;
            line-height: 1.4;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #1e3a8a;
            padding-bottom: 14px;
            margin-bottom: 18px;
        }

        .header h1 {
            font-size: 21px;
            color: #1e3a8a;
            margin: 0 0 5px;
            text-transform: uppercase;
        }

        .header h2 {
            font-size: 13px;
            letter-spacing: 2px;
            margin: 5px 0;
            color: #334155;
        }

        .header p {
            color: #64748b;
            margin: 5px 0 0;
            font-size: 9px;
        }

        .instructions {
            border: 1px solid #cbd5e1;
            background-color: #f8fafc;
            padding: 9px 12px;
            margin-bottom: 18px;
        }

        .position {
            margin-bottom: 20px;
        }

        .position-title {
            background-color: #1e3a8a;
            color: #ffffff;
            padding: 9px 11px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }

        table.candidates {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        table.candidates td {
            width: 50%;
            padding: 8px 6px;
            border: 1px solid #cbd5e1;
            vertical-align: top;
        }

        .candidate-card {
            width: 100%;
        }

        .candidate-photo {
            width: 75px;
            height: 82px;
            border: 1px solid #cbd5e1;
            padding: 2px;
        }

        .candidate-name {
            font-size: 10px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 5px;
        }

        .candidate-number {
            font-size: 9px;
            color: #64748b;
            margin-bottom: 7px;
        }

        .mark-box {
            display: inline-block;
            width: 15px;
            height: 15px;
            border: 1.5px solid #111827;
            margin-top: 7px;
        }

        .photo-placeholder {
            width: 75px;
            height: 82px;
            border: 1px solid #cbd5e1;
            text-align: center;
            color: #94a3b8;
            font-size: 8px;
        }

        .footer-note {
            margin-top: 16px;
            text-align: center;
            color: #64748b;
            font-size: 8px;
        }

        .footer {
            position: fixed;
            bottom: -25px;
            left: 0;
            right: 0;
            border-top: 1px solid #cbd5e1;
            padding-top: 6px;
            font-size: 8px;
            color: #64748b;
        }

        .footer .right {
            float: right;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>Election Ballot Paper</h1>
        <h2>OFFICIAL VOTING BALLOT</h2>
        <p>
            Eligible candidates only |
            Generated {{ $generatedAt->format('d M Y, H:i') }}
        </p>
    </div>

    <div class="instructions">
        <strong>VOTING INSTRUCTIONS</strong><br>
        Review the photograph and name of each candidate.
        Mark the box beside your preferred candidate for each position.
        Select only one candidate per position.
    </div>

    @foreach ($positions as $position)
        <div class="position">
            <div class="position-title">
                {{ $loop->iteration }}.
                {{ $position->name }}
            </div>

            <table class="candidates">
                <tbody>
                    @foreach ($position->contestants->chunk(2) as $row)
                        <tr>
                            @foreach ($row as $contestant)
                                <td>
                                    <table width="100%" cellpadding="0"
                                           cellspacing="0">
                                        <tr>
                                            <td width="85"
                                                style="border: 0; padding: 0;">
                                                @if ($contestant->ballot_photo)
                                                    <img
                                                        src="{{ $contestant->ballot_photo }}"
                                                        class="candidate-photo"
                                                        alt="Candidate photo"
                                                    >
                                                @else
                                                    <div class="photo-placeholder">
                                                        PHOTO<br>UNAVAILABLE
                                                    </div>
                                                @endif
                                            </td>

                                            <td style="border: 0; padding: 4px 5px;">
                                                <div class="candidate-number">
                                                    CANDIDATE
                                                    {{ $loop->parent->iteration }}
                                                </div>

                                                <div class="candidate-name">
                                                    {{ $contestant->full_name }}
                                                </div>

                                                <div>Mark your choice:</div>
                                                <div class="mark-box"></div>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            @endforeach

                            @if ($row->count() === 1)
                                <td style="border: 0;"></td>
                            @endif
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endforeach

    <div class="footer-note">
        Please check your selections before submitting your ballot.
    </div>

    <div class="footer">
        Official Ballot Paper
        <span class="right">
            Confidential election material
        </span>
    </div>

    <script type="text/php">
        if (isset($pdf)) {
            $pdf->page_text(
                500,
                820,
                "Page {PAGE_NUM} of {PAGE_COUNT}",
                null,
                8,
                array(100, 116, 139)
            );
        }
    </script>

</body>
</html>
