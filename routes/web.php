<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VotersController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;

Route::get('/create-public-link', function () {
    $target = base_path('public');
    $link = base_path('../public_html');

    if (file_exists($link) || is_link($link)) {
        return response()->json([
            'success' => false,
            'message' => 'The destination already exists. Remove or rename it before creating the link.',
        ], 409);
    }

    if (!is_dir($target)) {
        return response()->json([
            'success' => false,
            'message' => 'Laravel public directory was not found.',
        ], 404);
    }

    if (symlink($target, $link)) {
        return response()->json([
            'success' => true,
            'message' => 'Symbolic link created successfully.',
            'target' => $target,
            'link' => $link,
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Failed to create the symbolic link. Check hosting permissions.',
    ], 500);
});

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/vote', [VotersController::class, 'index'])->name('vote');

Route::put(
    '/admin/contestants/{contestant}',
    [VotersController::class, 'updateContestant']
)->name('admin.contestants.update');
Route::get('/', [VotersController::class, 'index'])->name('vote');
Route::get('/contestant/register', [VotersController::class, 'contestantRegister'])->name('contestant.register');
Route::post('/contestant/register', [VotersController::class, 'storeContestantRegister'])->name('contestant.register.submit');
Route::get('/results', [VotersController::class, 'results'])->name('results');


Route::post('/vote', [VotersController::class, 'storeVote'])
    ->name('vote.submit');

Route::get('/contestant/register', [
    VotersController::class,
    'contestantRegister',
])->name('contestant.register');

Route::post('/contestant/register', [
    VotersController::class,
    'storeContestantRegister',
])->name('contestant.register.submit');

Route::get('/results', [
    VotersController::class,
    'results',
])->name('results');

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->prefix('/admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dasboard'])->name('dashboard');
    Route::get('/contestants', [AdminController::class, 'contestants'])->name('admin.contestants');
    Route::get('/voters', [AdminController::class, 'voters'])->name('admin.voters');
    Route::get('/positions', [AdminController::class, 'positions'])->name('admin.positions');
    Route::get('/results', [AdminController::class, 'results'])->name('admin.results');
});

Route::middleware('auth')->group(function () {
    Route::post('/positions', [AdminController::class, 'storePosition'])->name('positions.store');
    Route::patch(
        '/admin/contestants/{contestant}/status',
        [AdminController::class, 'updateContestantStatus']
    )->name('admin.contestants.status');

    Route::patch(
        '/admin/contestants/{contestant}/payment-status',
        [AdminController::class, 'updateContestantPaymentStatus']
    )->name('admin.contestants.payment-status');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



require __DIR__ . '/auth.php';
