<script lang="ts">
    import { goto } from '$app/navigation';
    import { authClient } from '$lib/auth-client.ts';

    import Icon from '@iconify/svelte';
	import { toast } from '@zerodevx/svelte-toast';

    let credentials = $state({
        email: '',
        password: ''
    });

    let loading = $state(false);


    $effect(() => {
        credentials.email;
        credentials.password;
    });

    const redirect = () => {
        toast.push('Successfully signed in! Redirecting...');
        setTimeout(() => {
            goto('/');
        }, 2000);
    };

    const validateForm = () => {
        if (!credentials.email || !credentials.password) {
            toast.push('A Field is missing!');
            return false;
        } else {
            return true;
        }
    };

    // const logInUser = async () => {
    //  errorLog = '';
    //  if (!validateForm()) {
    //      return;
    //  }
    //  loading = true;

    //  await authClient.signIn
    //      .email({
    //          email: credentials.email,
    //          password: credentials.password
    //      })
    //      .then(() => {
    //          redirect();
    //      })
    //      .catch((error) => {
    //          console.log(error.message, error.status);
    //          errorLog = 'Failed to sign in.';
    //          throw new Error(`Failed to sign in ${error}`);
    //      })
    //      .finally(() => {
    //          credentials = {
    //              email: '',
    //              password: ''
    //          };

    //          loading = false;
    //      });
    // };

    const signInWithDiscord = async () => {
        loading = true;

        try {
            await authClient.signIn.social({
                provider: 'discord',
            });

        } catch (error: any) {
            console.error('Discord Sign-in Error:', error.message, error.status);
            toast.push(error.message || 'Failed to sign in with Discord.');
        } finally {
            loading = false;
        }
    };

    const signInWithGoogle = async () => {
        loading = true;

        let user;

        try {
            await authClient.signIn.social({
                provider: 'google',
            });

        } catch (error: any) {
            console.error('Google Sign-in Error:', error.message, error.status);
            toast.push(error.message || 'Failed to sign in with Google.');
        } finally {
            loading = false;
        }
    };
</script>

<main class="relative flex min-h-screen w-full flex-col md:flex-row overflow-hidden">
    <section class="w-full h-48 md:h-auto md:w-3/5 overflow-hidden">
        <img src="/images/field.png" alt="" class="h-full w-full object-cover" />
    </section>

    <section class="relative flex w-full md:w-2/5 items-center justify-center px-4 py-8 md:py-0">
        <button
            type="button"
            aria-label="Return Home"
            class="absolute top-4 right-4 cursor-pointer"
            onclick={() => {
                goto('/');
            }}><Icon icon="stash:signout-alt" class="text-5xl" /></button
        >
        <div class="flex w-full max-w-md flex-col gap-8">
            <div class="flex h-fit items-center justify-between">
                <h1 class="text-4xl">Log In</h1>
            </div>
            
            <div class="flex flex-col gap-4">
                <button type="button" class="btn-discord w-full flex items-center justify-center gap-2" disabled={loading} onclick={signInWithDiscord}>
                    <Icon icon="ic:baseline-discord" class="text-2xl" />
                    Log in with Discord
                </button>
                
                <button type="button" class="btn-google w-full flex items-center justify-center gap-2" disabled={loading} onclick={signInWithGoogle}>
                    <Icon icon="logos:google-icon" class="text-2xl" />
                    Log in with Google
                </button>
            </div>
        </div>
    </section>
</main>