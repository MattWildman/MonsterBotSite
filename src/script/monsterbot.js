var chance = new Chance(),
    pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) type = type.toLowerCase();
        element.addEventListener(pfx[p]+type, callback, false);
    }
}

function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

function preloadImgs(imgs) {
    for (var i = 0; i < imgs.length; i++) {
        (new Image()).src = 'images/' + imgs[i];
    }

}

var p = 0,
      mTot = 8,
      aTot = 5,
    $logo = $('.site-title'),
    $storyLines = $('.story-line'),
    $storyBoard = $('#story'),
    $storyMonsters = $('#story .monster'),
    storyMonsters = document.querySelectorAll('#story .monster'),
    $nextButton = $('<button/>').html('Next')
                                .addClass('next-button')
                                .click(function() {advanceStory();}),
    $skipButton = $('<button/>').html('<span class="btn-icon">&times;</span> Skip')
                                .addClass('skip-button')
                                .click(function() {skipStory();}),
    $header = $('.header').first(),
    fighters = document.querySelectorAll('.arena .monster');

function showBreakingNews() {
    var docHeight = $(document).height(),
        $news = $('#newsflash');
    $news.addClass('noise').show();
    setTimeout(function() {
        (function($news) {
            $news.removeClass('noise');
            $news.find('.news-text').removeClass('invisible');
        })($news);
    }, 2000);
}

function scheduleReveal(i, m) {
    setTimeout(function() {
        m.classList.add('fadeIn');
        m.classList.remove('invisible');
    }, i * 1500);
}

function revealMonsters() {
    for (var i = 0; i < storyMonsters.length; i++) {
        scheduleReveal(i, storyMonsters[i]);
    }
}

function advanceStory() {
    if (p == $storyLines.length - 1)
        showBreakingNews();
    if (p == $storyLines.length)
        skipStory();
    if (p < $storyLines.length)
        $storyLines[p].classList.remove('fadeIn');
    if (p < $storyLines.length - 1)
        $storyLines[p + 1].classList.add('fadeIn');
    if (p == 0)
        revealMonsters();
    p++;
}

function skipStory() {
    document.documentElement.className = '';
    $skipButton.remove();
    $nextButton.remove();
    sHeight = $storyBoard.height();
    $storyBoard.find('.content').hide();
    $storyBoard.animate({
        height: 0
    }, 2000);
    setup();
}

function startStory() {
  $logo.addClass('hidden');
    if (supportsStorage())
        localStorage.setItem('story', 'true');
    $storyLines.first().addClass('fadeIn');
    $storyBoard
        .height($(window).height())
        .append($skipButton)
        .find('.story-content').append($nextButton);
    preloadImgs(['noise.jpg', 'top_teeth2.png', 'top_teeth_med.png', 'top_teeth_small.png',
                 'blue_logo.png', 'arena-sprite.png', 'teeth2.png', 'teeth_med.png', 'teeth_small.png']);
}

function AnimationListener(e) {
    if (e.animationName == 'attack' || e.animationName == 'recoil') {
        e.target.classList.remove(e.animationName);
    }
    if (e.animationName == 'attack')
        setTimeout(function() {
            startBattle(fighters);
        }, 2500);
}

function startBattle(m) {
    a = Math.floor(Math.random() * 2);
    r = 1 - a;
    m[a].classList.add('attack');
    setTimeout(function() {m[r].classList.add('recoil');}, 500);
}

function setup() {
    mArray = new Array();
    for (var i = 1; i <= mTot; i++)
        mArray.push(i);
    mArray = shuffle(mArray);
    $('.arena .monster').each(function(i) {
        $(this)[0].className = 'monster monster-' + mArray[i];
    });

  PrefixedEvent(fighters[0], "AnimationEnd", AnimationListener);
  PrefixedEvent(fighters[1], "AnimationEnd", AnimationListener);

    a = Math.floor(Math.random() * aTot) + 1;
    $('.arena')[0].className = 'arena arena-' + a;

    $('.arena-header .team .monster-name').each(function() {
      $(this).text(chance.word());
    });

    setTimeout(function() {
       startBattle(fighters);
    }, 2500);

    var $menu = $('nav').first();
    $('.main-nav').addClass('js');
    $('.main-nav a').click(function() {
        target = $(this).attr('href');
        $('html, body').animate({
           scrollTop: $(target).offset().top //- $menu.height()
        }, 1500);
        return false;
    });
    $('.inner-guide-section').hide();
    $('.expander').click(function() {
        $this = $(this);
        $this.next().slideToggle(1000, function() {
            $this.toggleClass('collapser')
        });
    });

    $logo.removeClass('hidden');

    $('#guide .monster').each(function() {
        PrefixedEvent($(this)[0], "AnimationEnd", AnimationListener);
    }).click(function() {
        $(this).addClass('recoil')
    });
}

$(function() {
    if (document.documentElement.className == 'story-mode')
        startStory();
    else
        setup();
});
