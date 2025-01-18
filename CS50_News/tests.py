from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from models import New

# Create your tests here.

class addTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.add_url = reverse("add")

    def test_adding(self):
        with open(r"C:\Users\hassa\OneDrive\Desktop\code\CS50_News\CS50_News\static\CS50_News\cover\bridg.jfif", 'rb') as img:
            blob = SimpleUploadedFile("bridg.jfif", img.read(), "image/jfif")
        response = self.client.post(self.add_url, {
            "headline": "test",
            "sub_headline": "sub test",
            "category": "News",
            "sub_category": "Israil-Gaza_war",
            "tags": "love,hi,test",
            "content": "#full of love test",
            "blob": blob,
        })
        
        self.assertEqual(response.status_code, 302)
        


