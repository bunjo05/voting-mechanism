<?php

namespace App\Mail;

use App\Models\Contestant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContestantRegisteredMail extends Mailable
{
    use Queueable, SerializesModels;

    public Contestant $contestant;

    public function __construct(Contestant $contestant)
    {
        $this->contestant = $contestant;
    }

    public function build()
    {
        return $this->subject('New Contestant Registration')
            ->view('emails.contestant-registered');
    }
}
