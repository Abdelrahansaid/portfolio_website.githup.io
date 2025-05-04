/*
    Massively by HTML5 UP
    html5up.net | @ajlkn
    Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

    var	$window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $header = $('#header'),
        $nav = $('#nav'),
        $main = $('#main'),
        $navPanelToggle, $navPanel, $navPanelInner;

    // Breakpoints configuration
    breakpoints({
        default:   ['1681px',   null       ],
        xlarge:    ['1281px',   '1680px'   ],
        large:     ['981px',    '1280px'   ],
        medium:    ['737px',    '980px'    ],
        small:     ['481px',    '736px'    ],
        xsmall:    ['361px',    '480px'    ],
        xxsmall:   [null,       '360px'    ]
    });

    /**
     * Parallax scrolling effect for background images
     * @param {number} intensity - Strength of the parallax effect
     */
    $.fn._parallax = function(intensity) {
        var $window = $(window),
            $this = $(this);

        if (this.length == 0 || intensity === 0) return $this;

        if (this.length > 1) {
            for (var i=0; i < this.length; i++)
                $(this[i])._parallax(intensity);
            return $this;
        }

        if (!intensity) intensity = 0.25;

        this.each(function() {
            var $t = $(this),
                $bg = $('<div class="bg"></div>').appendTo($t);

            function on() {
                $bg.removeClass('fixed').css('transform', 'matrix(1,0,0,1,0,0)');
                $window.on('scroll._parallax', function() {
                    var pos = $window.scrollTop() - $t.position().top;
                    $bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');
                });
            }

            function off() {
                $bg.addClass('fixed').css('transform', 'none');
                $window.off('scroll._parallax');
            }

            // Disable parallax on mobile devices and hi-res screens
            if (browser.name == 'ie' || 
                browser.name == 'edge' || 
                window.devicePixelRatio > 1 || 
                browser.mobile) {
                off();
            } else {
                breakpoints.on('>large', on);
                breakpoints.on('<=large', off);
            }
        });

        $window.on('load._parallax resize._parallax', function() {
            $window.trigger('scroll');
        });

        return this;
    };

    // Initial page load animations
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Smooth scrolling for anchor links
    $('.scrolly').scrolly({
        speed: 1000,
        offset: $header.height()
    });

    // Background parallax effect
    $wrapper._parallax(0.925);

    // Navigation Panel Setup
    setupNavPanel();

    function setupNavPanel() {
        // Create mobile menu toggle
        $navPanelToggle = $('<a href="#navPanel" id="navPanelToggle">Menu</a>')
            .appendTo($wrapper);

        // Toggle styling based on scroll position
        $header.scrollex({
            bottom: '5vh',
            enter: function() {
                $navPanelToggle.removeClass('alt');
            },
            leave: function() {
                $navPanelToggle.addClass('alt');
            }
        });

        // Create navigation panel
        $navPanel = $('<div id="navPanel"><nav></nav><a href="#navPanel" class="close"></a></div>')
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'right',
                target: $body,
                visibleClass: 'is-navPanel-visible'
            });

        $navPanelInner = $navPanel.children('nav');
        moveNavContent();

        // Handle responsive navigation
        breakpoints.on('<=medium', moveNavContent);
        breakpoints.on('>medium', moveNavContent);

        // Performance optimization for Windows Phone
        if (browser.os == 'wp' && browser.osVersion < 10) {
            $navPanel.css('transition', 'none');
        }
    }

    function moveNavContent() {
        var $navContent = $nav.children(),
            isMobile = breakpoints.active('<=medium');

        if (isMobile && !$navPanelInner.children().length) {
            $navContent.appendTo($navPanelInner);
        } else if (!isMobile && $navPanelInner.children().length) {
            $navPanelInner.children().appendTo($nav);
        }
    }

    // Intro section handling
    setupIntro();

    function setupIntro() {
        var $intro = $('#intro');
        if ($intro.length === 0) return;

        // IE flexbox fix
        if (browser.name == 'ie') {
            $window.on('resize.ie-intro-fix', function() {
                var h = $intro.height();
                $intro.css('height', h > $window.height() ? 'auto' : h);
            }).trigger('resize.ie-intro-fix');
        }

        // Hide intro on scroll
        $main.unscrollex();
        
        $main.scrollex({
            mode: 'middle',
            top: '25vh',
            bottom: '-50vh',
            enter: function() {
                $intro.addClass('hidden');
            },
            leave: function() {
                $intro.removeClass('hidden');
            }
        });
    }

    // Form submission handling (basic validation)
    setupFormValidation();

    function setupFormValidation() {
        $('form').submit(function(e) {
            e.preventDefault();
            var $form = $(this),
                valid = true;

            $form.find('input, textarea').each(function() {
                if ($(this).prop('required') && !$(this).val().trim()) {
                    $(this).addClass('error');
                    valid = false;
                }
            });

            if (valid) {
                // Simple success message (replace with actual form handling)
                alert('Thank you for your message!');
                $form[0].reset();
            }
        });
    }

})(jQuery);