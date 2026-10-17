<?php

namespace App\Mail;

use App\Models\Contestant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContestantStatusUpdated extends Mailable
{
    use Queueable, SerializesModels;

    public Contestant $contestant;
    public string $updateType;
    public string $oldValue;
    public string $newValue;

    public function __construct(
        Contestant $contestant,
        string $updateType,
        string $oldValue,
        string $newValue
    ) {
        $this->contestant = $contestant;
        $this->updateType = $updateType;
        $this->oldValue = $oldValue;
        $this->newValue = $newValue;
    }

    public function build()
    {
        return $this->subject(
            'Contestant ' . ucfirst($this->updateType) . ' Update'
        )->view('emails.contestant-status-updated');
    }
}
