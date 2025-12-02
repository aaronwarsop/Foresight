<template>
  <div class="min-h-screen bg-backgroundPrimary">
    <div class="container mx-auto">
      <div class="pt-8 mb-16">
        <Nav />
      </div>

      <section class="grid grid-cols-3 gap-16 mb-12">
        <article class="">
          <AccountValue />
        </article>

        <article>
          <DiviValue />
        </article>

        <article>
          <News />
        </article>
      </section>

      <section class="flex flex-row gap-16">
        <article class="w-1/3">
          <PortfolioAllocation />
        </article>

        <article class="w-2/3">
          <StockList />
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()

console.log(route.params.id)

</script>