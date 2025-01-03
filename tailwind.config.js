/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: 'var(--secondary)',
  				foreground: 'var(--secondary-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			chart: {
  				'1': 'var(--chart-1)',
  				'2': 'var(--chart-2)',
  				'3': 'var(--chart-3)',
  				'4': 'var(--chart-4)',
  				'5': 'var(--chart-5)'
  			}
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					'--tw-prose-body': 'var(--foreground)',
  					'--tw-prose-headings': 'var(--header)',
  					'--tw-prose-links': 'var(--primary)',
  					'--tw-prose-bold': 'var(--foreground)',
  					'--tw-prose-counters': 'var(--muted-foreground)',
  					'--tw-prose-bullets': 'var(--muted-foreground)',
  					'--tw-prose-hr': 'var(--border)',
  					'--tw-prose-quotes': 'var(--foreground)',
  					'--tw-prose-quote-borders': 'var(--border)',
  					'--tw-prose-captions': 'var(--muted-foreground)',
  					'--tw-prose-code': 'var(--foreground)',
  					'--tw-prose-pre-code': 'var(--foreground)',
  					'--tw-prose-pre-bg': 'var(--card)',
  					'--tw-prose-th-borders': 'var(--border)',
  					'--tw-prose-td-borders': 'var(--border)'
  				}
  			}
  		}
  	},
  	keyframes: {
  		"caret-blink": {
  			"0%,70%,100%": { opacity: "1" },
  			"20%,50%": { opacity: "0" },
  		},
  	},
  	animation: {
  		"caret-blink": "caret-blink 1.25s ease-out infinite",
  	},
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
}