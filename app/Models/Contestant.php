<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contestant extends Model
{
    use HasFactory;
    protected $fillable = [
        'full_name',
        'email',
        'phone_number',
        'address',
        'position_id',
        'passport_number',
        'passport_photo',
        'status',
        'payment_status',
    ];
    public function position()
    {
        return $this->belongsTo(Position::class);
    }

    public function votes()
    {
        return $this->hasMany(Vote::class);
    }
    public function voters()
    {
        return $this->belongsToMany(Voter::class, 'votes', 'contestant_id', 'voter_id');
    }
}
